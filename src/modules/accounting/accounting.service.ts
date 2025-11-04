import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AccountingEntry, EntryType, EntryCategory } from './entities/accounting-entry.entity';
import { AccountingReport, ReportPeriod } from './entities/accounting-report.entity';
import { Store } from '../stores/entities/store.entity';
import { Sale } from '../sales/entities/sale.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(AccountingEntry)
    private accountingEntryRepository: Repository<AccountingEntry>,
    @InjectRepository(AccountingReport)
    private accountingReportRepository: Repository<AccountingReport>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * Registrar entrada contable automáticamente desde una venta
   */
  async registerSaleEntry(sale: Sale): Promise<AccountingEntry> {
    const entry = this.accountingEntryRepository.create({
      storeId: sale.storeId,
      type: EntryType.INCOME,
      category: EntryCategory.SALES,
      date: new Date(sale.createdAt),
      description: `Venta #${sale.invoiceNumber || sale.id}`,
      amount: Number(sale.total),
      tax: Number(sale.total) * 0.19, // IVA 19%
      netAmount: Number(sale.total) / 1.19,
      currency: sale.store?.currency || 'COP',
      saleId: sale.id,
      invoiceNumber: sale.invoiceNumber,
    });

    return this.accountingEntryRepository.save(entry);
  }

  /**
   * Registrar entrada contable automáticamente desde un pedido online
   */
  async registerOrderEntry(order: Order): Promise<AccountingEntry> {
    const orderWithBase = order as Order & { id: number; createdAt: Date };
    const entry = this.accountingEntryRepository.create({
      storeId: order.storeId,
      type: EntryType.INCOME,
      category: EntryCategory.ONLINE_SALES,
      date: new Date(orderWithBase.createdAt),
      description: `Pedido online #${order.orderNumber}`,
      amount: Number(order.total),
      tax: Number(order.tax),
      netAmount: Number(order.subtotal),
      currency: order.currency || 'COP',
      orderId: orderWithBase.id,
      invoiceNumber: order.invoiceNumber,
    });

    return this.accountingEntryRepository.save(entry);
  }

  /**
   * Registrar gasto manual
   */
  async registerExpense(
    storeId: number,
    category: EntryCategory,
    amount: number,
    description: string,
    date: Date,
    userId?: number,
    notes?: string,
  ): Promise<AccountingEntry> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Tienda no encontrada');
    }

    const tax = 0; // Los gastos no tienen IVA (depende del tipo)
    const entry = this.accountingEntryRepository.create({
      storeId,
      type: EntryType.EXPENSE,
      category,
      date,
      description,
      amount,
      tax,
      netAmount: amount,
      currency: store.currency || 'COP',
      userId,
      notes,
    });

    return this.accountingEntryRepository.save(entry);
  }

  /**
   * Obtener entradas contables con filtros
   */
  async getEntries(filters: {
    storeId: number;
    startDate?: Date;
    endDate?: Date;
    type?: EntryType;
    category?: EntryCategory;
  }) {
    const query = this.accountingEntryRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.store', 'store')
      .leftJoinAndSelect('entry.user', 'user')
      .where('entry.storeId = :storeId', { storeId: filters.storeId });

    if (filters.startDate && filters.endDate) {
      query.andWhere('entry.date BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters.type) {
      query.andWhere('entry.type = :type', { type: filters.type });
    }

    if (filters.category) {
      query.andWhere('entry.category = :category', { category: filters.category });
    }

    return query.orderBy('entry.date', 'DESC').getMany();
  }

  /**
   * Generar reporte contable
   */
  async generateReport(
    storeId: number,
    period: ReportPeriod,
    startDate: Date,
    endDate: Date,
  ): Promise<AccountingReport> {
    const entries = await this.getEntries({
      storeId,
      startDate,
      endDate,
    });

    const incomeEntries = entries.filter((e) => e.type === EntryType.INCOME);
    const expenseEntries = entries.filter((e) => e.type === EntryType.EXPENSE);

    const totalIncome = incomeEntries.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpenses = expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalTax = entries.reduce((sum, e) => sum + Number(e.tax), 0);
    const netProfit = totalIncome - totalExpenses;
    const cashFlow = netProfit; // Simplificado

    const report = this.accountingReportRepository.create({
      storeId,
      period,
      startDate,
      endDate,
      totalIncome,
      totalExpenses,
      netProfit,
      totalTax,
      cashFlow,
      salesCount: incomeEntries.filter((e) =>
        [EntryCategory.SALES, EntryCategory.ONLINE_SALES].includes(e.category),
      ).length,
      expensesCount: expenseEntries.length,
    });

    return this.accountingReportRepository.save(report);
  }

  /**
   * Obtener resumen financiero
   */
  async getFinancialSummary(storeId: number, startDate: Date, endDate: Date) {
    const entries = await this.getEntries({
      storeId,
      startDate,
      endDate,
    });

    const incomeEntries = entries.filter((e) => e.type === EntryType.INCOME);
    const expenseEntries = entries.filter((e) => e.type === EntryType.EXPENSE);

    return {
      totalIncome: incomeEntries.reduce((sum, e) => sum + Number(e.amount), 0),
      totalExpenses: expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0),
      totalTax: entries.reduce((sum, e) => sum + Number(e.tax), 0),
      netProfit:
        incomeEntries.reduce((sum, e) => sum + Number(e.amount), 0) -
        expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0),
      incomeCount: incomeEntries.length,
      expenseCount: expenseEntries.length,
      entries,
    };
  }
}

