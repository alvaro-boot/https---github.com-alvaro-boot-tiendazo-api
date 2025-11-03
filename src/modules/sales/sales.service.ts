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

    // Crear la venta
    const sale = this.saleRepository.create({
      ...saleData,
      userId,
      profit: 0, // Se calculará después
    });

    const savedSale = await this.saleRepository.save(sale);

    // Crear detalles y actualizar stock
    let totalProfit = 0;
    const saleDetails = [];

    for (const detail of details) {
      const product = await this.productRepository.findOne({
        where: { id: detail.productId },
      });

      // Crear detalle de venta
      const saleDetail = this.saleDetailRepository.create({
        ...detail,
        saleId: savedSale.id,
        subtotal: detail.quantity * detail.unitPrice,
      });

      const savedDetail = await this.saleDetailRepository.save(saleDetail);
      saleDetails.push(savedDetail);

      // Actualizar stock
      product.stock -= detail.quantity;
      await this.productRepository.save(product);

      // Calcular ganancia
      const profit =
        (detail.unitPrice - product.purchasePrice) * detail.quantity;
      totalProfit += profit;
    }

    // Actualizar ganancia total
    savedSale.profit = totalProfit;
    await this.saleRepository.save(savedSale);

    // Si es venta a crédito, actualizar deuda del cliente
    if (savedSale.isCredit && savedSale.clientId) {
      const client = await this.clientRepository.findOne({
        where: { id: savedSale.clientId },
      });
      if (client) {
        // Convertir valores a número para asegurar precisión
        const currentDebt = parseFloat(String(client.debt || 0));
        const saleTotal = parseFloat(String(savedSale.total || 0));
        client.debt = currentDebt + saleTotal;
        await this.clientRepository.save(client);
        console.log(`✅ Deuda actualizada para cliente ${client.id}: ${currentDebt} + ${saleTotal} = ${client.debt}`);
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
      .leftJoinAndSelect("details.product", "product");

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
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ["user", "store", "client", "details", "details.product"],
    });

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
    const sale = await this.findOne(id);
    await this.saleRepository.remove(sale);
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
