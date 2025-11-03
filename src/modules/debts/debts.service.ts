import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DebtPayment, PaymentType } from './entities/debt-payment.entity';
import { Client } from '../clients/entities/client.entity';
import { CreateDebtPaymentDto } from './dto/create-payment.dto';
import { DebtReportDto } from './dto/debt-report.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(DebtPayment)
    private paymentRepository: Repository<DebtPayment>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async createPayment(createPaymentDto: CreateDebtPaymentDto, userId: number): Promise<DebtPayment> {
    const { clientId, amount, paymentType = PaymentType.CASH, reference, notes } = createPaymentDto;

    const client = await this.clientRepository.findOne({
      where: { id: clientId }
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    if (client.debt < amount) {
      throw new BadRequestException('Payment amount exceeds client debt');
    }

    // Convertir valores a número para asegurar precisión
    const previousDebt = parseFloat(String(client.debt || 0));
    const paymentAmount = parseFloat(String(amount || 0));
    const newDebt = previousDebt - paymentAmount;

    // Crear el pago
    const payment = this.paymentRepository.create({
      clientId,
      amount: paymentAmount,
      paymentType,
      reference,
      notes,
      userId,
      previousDebt,
      newDebt,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Actualizar deuda del cliente
    client.debt = newDebt;
    await this.clientRepository.save(client);

    return this.findOne(savedPayment.id);
  }

  async findAll(reportDto?: DebtReportDto): Promise<DebtPayment[]> {
    const query = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.client', 'client')
      .leftJoinAndSelect('payment.user', 'user')
      .orderBy('payment.createdAt', 'DESC');

    if (reportDto?.startDate && reportDto?.endDate) {
      query.andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
        startDate: reportDto.startDate,
        endDate: reportDto.endDate,
      });
    }

    if (reportDto?.clientId) {
      query.andWhere('payment.clientId = :clientId', { clientId: reportDto.clientId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<DebtPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['client', 'user'],
    });

    if (!payment) {
      throw new NotFoundException(`Debt payment with ID ${id} not found`);
    }

    return payment;
  }

  async getClientDebtHistory(clientId: number): Promise<DebtPayment[]> {
    return this.paymentRepository.find({
      where: { clientId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDebtReport(reportDto: DebtReportDto) {
    const payments = await this.findAll(reportDto);
    
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalCount = payments.length;

    // Agrupar por tipo de pago
    const paymentsByType = payments.reduce((acc, payment) => {
      const type = payment.paymentType;
      if (!acc[type]) {
        acc[type] = { count: 0, total: 0 };
      }
      acc[type].count++;
      acc[type].total += payment.amount;
      return acc;
    }, {});

    return {
      period: {
        startDate: reportDto.startDate,
        endDate: reportDto.endDate,
      },
      summary: {
        totalPayments,
        totalCount,
        averagePayment: totalCount > 0 ? totalPayments / totalCount : 0,
        paymentsByType,
      },
      payments,
    };
  }

  async getClientsWithDebt(): Promise<Client[]> {
    return this.clientRepository
      .createQueryBuilder('client')
      .where('client.debt > :minDebt', { minDebt: 0 })
      .orderBy('client.debt', 'DESC')
      .getMany();
  }

  async getTotalDebt(): Promise<{ total: number }> {
    const result = await this.clientRepository
      .createQueryBuilder('client')
      .select('SUM(client.debt)', 'total')
      .getRawOne();

    const total = parseFloat(result?.total) || 0;
    return { total };
  }
}
