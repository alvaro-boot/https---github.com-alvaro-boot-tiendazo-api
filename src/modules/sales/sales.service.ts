import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Sale } from "./entities/sale.entity";
import { SaleDetail } from "./entities/sale-detail.entity";
import { Product } from "../products/entities/product.entity";
import { Client } from "../clients/entities/client.entity";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { SaleReportDto } from "./dto/sale-report.dto";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailRepository: Repository<SaleDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: number): Promise<Sale> {
    const { details, ...saleData } = createSaleDto;

    // Verificar stock disponible
    for (const detail of details) {
      const product = await this.productRepository.findOne({
        where: { id: detail.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${detail.productId} not found`
        );
      }

      if (product.stock < detail.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`
        );
      }
    }

    // Crear la venta (sin guardar aún)
    const sale = this.saleRepository.create({
      ...saleData,
      userId,
      profit: 0, // Se calculará después
      total: 0, // Se calculará desde los detalles para asegurar precisión
    });

    // Primero calcular el total desde los detalles y crear los detalles
    let calculatedTotal = 0;
    let totalProfit = 0;
    const saleDetails = [];

    for (const detail of details) {
      const product = await this.productRepository.findOne({
        where: { id: detail.productId },
      });

      // Calcular subtotal con precisión decimal
      const unitPrice = parseFloat(String(detail.unitPrice || 0));
      const quantity = parseInt(String(detail.quantity || 0));
      const subtotal = parseFloat((unitPrice * quantity).toFixed(2));
      calculatedTotal += subtotal;

      // Crear detalle de venta
      const saleDetail = this.saleDetailRepository.create({
        ...detail,
        saleId: 0, // Se actualizará después de guardar la venta
        subtotal: subtotal,
      });

      // Actualizar stock
      product.stock -= quantity;
      await this.productRepository.save(product);

      // Calcular ganancia con precisión decimal
      const purchasePrice = parseFloat(String(product.purchasePrice || 0));
      const profit = parseFloat(((unitPrice - purchasePrice) * quantity).toFixed(2));
      totalProfit += profit;
      
      saleDetails.push(saleDetail);
    }

    // Establecer el total calculado desde los detalles
    sale.total = parseFloat(calculatedTotal.toFixed(2));
    sale.profit = parseFloat(totalProfit.toFixed(2));

    // Guardar la venta con el total correcto
    const savedSale = await this.saleRepository.save(sale);

    // Ahora guardar los detalles con el saleId correcto
    for (const detail of saleDetails) {
      detail.saleId = savedSale.id;
      await this.saleDetailRepository.save(detail);
    }

    // Si es venta a crédito, actualizar deuda del cliente
    if (savedSale.isCredit && savedSale.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: savedSale.clientId },
      });
      if (client) {
        // Convertir valores a número para asegurar precisión
        // Usar Number() en lugar de parseFloat() para manejar correctamente los decimales de MySQL
        const currentDebt = Number(client.debt || 0);
        const saleTotal = Number(savedSale.total || 0);
        // Calcular nueva deuda con precisión
        const newDebt = Number((currentDebt + saleTotal).toFixed(2));
        client.debt = newDebt;
        await this.clientRepository.save(client);
        console.log(`✅ Deuda actualizada para cliente ${client.id}: ${currentDebt} + ${saleTotal} = ${newDebt}`);
      }
    }

    return this.findOne(savedSale.id);
  }

  async findAll(reportDto?: SaleReportDto): Promise<Sale[]> {
    const query = this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.user", "user")
      .leftJoinAndSelect("sale.store", "store")
      .leftJoinAndSelect("sale.client", "client")
      .leftJoinAndSelect("sale.details", "details")
      .leftJoinAndSelect("details.product", "product")
      .where("sale.deletedAt IS NULL"); // Excluir ventas eliminadas lógicamente

    if (reportDto?.startDate && reportDto?.endDate) {
      query.andWhere("sale.createdAt BETWEEN :startDate AND :endDate", {
        startDate: reportDto.startDate,
        endDate: reportDto.endDate,
      });
    }

    if (reportDto?.storeId) {
      query.andWhere("sale.storeId = :storeId", { storeId: reportDto.storeId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.user", "user")
      .leftJoinAndSelect("sale.store", "store")
      .leftJoinAndSelect("sale.client", "client")
      .leftJoinAndSelect("sale.details", "details")
      .leftJoinAndSelect("details.product", "product")
      .where("sale.id = :id", { id })
      .andWhere("sale.deletedAt IS NULL") // Excluir ventas eliminadas lógicamente
      .getOne();

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);
    Object.assign(sale, updateSaleDto);
    return this.saleRepository.save(sale);
  }

  async cancel(id: number): Promise<Sale> {
    const sale = await this.findOne(id);

    if (sale.canceledAt) {
      throw new BadRequestException("Sale is already canceled");
    }

    // Restaurar stock
    for (const detail of sale.details) {
      const product = await this.productRepository.findOne({
        where: { id: detail.productId },
      });
      if (product) {
        product.stock += detail.quantity;
        await this.productRepository.save(product);
      }
    }

    // Si era venta a crédito, reducir deuda del cliente
    if (sale.isCredit && sale.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: sale.clientId },
      });
      if (client) {
        client.debt -= sale.total;
        await this.clientRepository.save(client);
      }
    }

    sale.canceledAt = new Date();
    return this.saleRepository.save(sale);
  }

  async remove(id: number): Promise<void> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ["details"],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    // Restaurar stock de productos si la venta no está cancelada
    if (!sale.canceledAt && sale.details && sale.details.length > 0) {
      for (const detail of sale.details) {
        const product = await this.productRepository.findOne({
          where: { id: detail.productId },
        });
        
        if (product) {
          const currentStock = parseFloat(String(product.stock || 0));
          const quantity = parseInt(String(detail.quantity || 0));
          product.stock = currentStock + quantity;
          await this.productRepository.save(product);
          console.log(`✅ Stock restaurado para producto ${product.id}: ${currentStock} + ${quantity} = ${product.stock}`);
        }
      }
    }
    
    // Restaurar deuda del cliente si es venta a crédito
    if (sale.isCredit && sale.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: sale.clientId },
      });
      
      if (client && sale.total) {
        const currentDebt = parseFloat(String(client.debt || 0));
        const saleTotal = parseFloat(String(sale.total || 0));
        const newDebt = Math.max(0, parseFloat((currentDebt - saleTotal).toFixed(2)));
        client.debt = newDebt;
        await this.clientRepository.save(client);
        console.log(`✅ Deuda restaurada para cliente ${client.id}: ${currentDebt} - ${saleTotal} = ${newDebt}`);
      }
    }
    
    // Soft delete - usar softRemove en lugar de remove
    await this.saleRepository.softRemove(sale);
    console.log(`✅ Venta ${id} eliminada lógicamente (soft delete)`);
  }

  async getSalesReport(reportDto: SaleReportDto) {
    const sales = await this.findAll(reportDto);

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalCount = sales.length;
    const creditSales = sales.filter((sale) => sale.isCredit).length;
    const cashSales = totalCount - creditSales;

    return {
      period: {
        startDate: reportDto.startDate,
        endDate: reportDto.endDate,
      },
      summary: {
        totalSales,
        totalProfit,
        totalCount,
        creditSales,
        cashSales,
        averageSale: totalCount > 0 ? totalSales / totalCount : 0,
      },
      sales,
    };
  }
}
