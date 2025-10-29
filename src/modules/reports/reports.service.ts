import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Sale } from "../sales/entities/sale.entity";
import { Product } from "../products/entities/product.entity";
import { Client } from "../clients/entities/client.entity";
import { DebtPayment } from "../debts/entities/debt-payment.entity";
import { InventoryMovement } from "../inventory/entities/inventory-movement.entity";
import { ReportRequestDto, ReportType } from "./dto/report-request.dto";
import * as ExcelJS from "exceljs";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(DebtPayment)
    private paymentRepository: Repository<DebtPayment>,
    @InjectRepository(InventoryMovement)
    private movementRepository: Repository<InventoryMovement>
  ) {}

  async generateReport(reportDto: ReportRequestDto) {
    const {
      type,
      startDate,
      endDate,
      storeId,
      clientId,
      productId,
      format = "json",
    } = reportDto;

    let data: any;

    switch (type) {
      case ReportType.SALES:
        data = await this.generateSalesReport(
          startDate,
          endDate,
          storeId,
          clientId
        );
        break;
      case ReportType.INVENTORY:
        data = await this.generateInventoryReport(storeId, productId);
        break;
      case ReportType.DEBTS:
        data = await this.generateDebtsReport(startDate, endDate, clientId);
        break;
      case ReportType.PROFITS:
        data = await this.generateProfitsReport(startDate, endDate, storeId);
        break;
      case ReportType.CLIENTS:
        data = await this.generateClientsReport(storeId);
        break;
      case ReportType.PRODUCTS:
        data = await this.generateProductsReport(storeId, productId);
        break;
      default:
        throw new Error("Invalid report type");
    }

    if (format === "excel") {
      return this.generateExcelReport(data, type);
    }

    return data;
  }

  private async generateSalesReport(
    startDate?: string,
    endDate?: string,
    storeId?: number,
    clientId?: number
  ) {
    const query = this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.user", "user")
      .leftJoinAndSelect("sale.store", "store")
      .leftJoinAndSelect("sale.client", "client")
      .leftJoinAndSelect("sale.details", "details")
      .leftJoinAndSelect("details.product", "product");

    if (startDate && endDate) {
      query.andWhere("sale.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      });
    }

    if (storeId) {
      query.andWhere("sale.storeId = :storeId", { storeId });
    }

    if (clientId) {
      query.andWhere("sale.clientId = :clientId", { clientId });
    }

    const sales = await query.getMany();

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const creditSales = sales.filter((sale) => sale.isCredit);
    const cashSales = sales.filter((sale) => !sale.isCredit);

    return {
      type: "SALES",
      period: { startDate, endDate },
      summary: {
        totalSales,
        totalProfit,
        totalCount: sales.length,
        creditSales: creditSales.length,
        cashSales: cashSales.length,
        averageSale: sales.length > 0 ? totalSales / sales.length : 0,
      },
      data: sales,
    };
  }

  private async generateInventoryReport(storeId?: number, productId?: number) {
    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store")
      .where("product.isActive = :isActive", { isActive: true });

    if (storeId) {
      query.andWhere("product.storeId = :storeId", { storeId });
    }

    if (productId) {
      query.andWhere("product.id = :productId", { productId });
    }

    const products = await query.getMany();

    const totalValue = products.reduce(
      (sum, product) => sum + product.stock * product.purchasePrice,
      0
    );
    const lowStockProducts = products.filter(
      (product) => product.stock <= product.minStock
    );

    return {
      type: "INVENTORY",
      summary: {
        totalProducts: products.length,
        totalValue,
        lowStockCount: lowStockProducts.length,
        averageStock:
          products.length > 0
            ? products.reduce((sum, p) => sum + p.stock, 0) / products.length
            : 0,
      },
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name,
        stock: product.stock,
        minStock: product.minStock,
        purchasePrice: product.purchasePrice,
        sellPrice: product.sellPrice,
        value: product.stock * product.purchasePrice,
        isLowStock: product.stock <= product.minStock,
      })),
    };
  }

  private async generateDebtsReport(
    startDate?: string,
    endDate?: string,
    clientId?: number
  ) {
    const query = this.clientRepository
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.sales", "sales")
      .where("client.debt > :debt", { debt: 0 });

    if (clientId) {
      query.andWhere("client.id = :clientId", { clientId });
    }

    const clients = await query.getMany();

    const totalDebt = clients.reduce((sum, client) => sum + client.debt, 0);

    // Obtener pagos si hay fechas
    let payments = [];
    if (startDate && endDate) {
      const paymentQuery = this.paymentRepository
        .createQueryBuilder("payment")
        .leftJoinAndSelect("payment.client", "client")
        .leftJoinAndSelect("payment.user", "user")
        .where("payment.createdAt BETWEEN :startDate AND :endDate", {
          startDate,
          endDate,
        });

      if (clientId) {
        paymentQuery.andWhere("payment.clientId = :clientId", { clientId });
      }

      payments = await paymentQuery.getMany();
    }

    return {
      type: "DEBTS",
      period: { startDate, endDate },
      summary: {
        totalDebt,
        clientsWithDebt: clients.length,
        totalPayments: payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
        averageDebt: clients.length > 0 ? totalDebt / clients.length : 0,
      },
      data: {
        clients: clients.map((client) => ({
          id: client.id,
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          debt: client.debt,
        })),
        payments,
      },
    };
  }

  private async generateProfitsReport(
    startDate?: string,
    endDate?: string,
    storeId?: number
  ) {
    const query = this.saleRepository
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.store", "store")
      .leftJoinAndSelect("sale.details", "details")
      .leftJoinAndSelect("details.product", "product");

    if (startDate && endDate) {
      query.andWhere("sale.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      });
    }

    if (storeId) {
      query.andWhere("sale.storeId = :storeId", { storeId });
    }

    const sales = await query.getMany();

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    // Agrupar por producto
    const productProfits = {};
    sales.forEach((sale) => {
      sale.details.forEach((detail) => {
        const productId = detail.product.id;
        if (!productProfits[productId]) {
          productProfits[productId] = {
            product: detail.product.name,
            quantity: 0,
            totalSales: 0,
            totalProfit: 0,
          };
        }
        productProfits[productId].quantity += detail.quantity;
        productProfits[productId].totalSales += detail.subtotal;
        productProfits[productId].totalProfit +=
          (detail.unitPrice - detail.product.purchasePrice) * detail.quantity;
      });
    });

    return {
      type: "PROFITS",
      period: { startDate, endDate },
      summary: {
        totalSales,
        totalProfit,
        profitMargin,
        totalCount: sales.length,
        averageProfit: sales.length > 0 ? totalProfit / sales.length : 0,
      },
      data: {
        sales,
        productProfits: Object.values(productProfits),
      },
    };
  }

  private async generateClientsReport(storeId?: number) {
    const query = this.clientRepository
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.sales", "sales")
      .leftJoinAndSelect("sales.store", "store");

    if (storeId) {
      query.andWhere("sales.storeId = :storeId", { storeId });
    }

    const clients = await query.getMany();

    const totalClients = clients.length;
    const clientsWithDebt = clients.filter((client) => client.debt > 0).length;
    const totalDebt = clients.reduce((sum, client) => sum + client.debt, 0);

    return {
      type: "CLIENTS",
      summary: {
        totalClients,
        clientsWithDebt,
        clientsWithoutDebt: totalClients - clientsWithDebt,
        totalDebt,
        averageDebt: totalClients > 0 ? totalDebt / totalClients : 0,
      },
      data: clients.map((client) => ({
        id: client.id,
        fullName: client.fullName,
        email: client.email,
        phone: client.phone,
        debt: client.debt,
        totalPurchases: client.sales.reduce((sum, sale) => sum + sale.total, 0),
        purchaseCount: client.sales.length,
      })),
    };
  }

  private async generateProductsReport(storeId?: number, productId?: number) {
    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store")
      .leftJoinAndSelect("product.saleDetails", "saleDetails")
      .leftJoinAndSelect("saleDetails.sale", "sale");

    if (storeId) {
      query.andWhere("product.storeId = :storeId", { storeId });
    }

    if (productId) {
      query.andWhere("product.id = :productId", { productId });
    }

    const products = await query.getMany();

    return {
      type: "PRODUCTS",
      summary: {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        lowStockProducts: products.filter((p) => p.stock <= p.minStock).length,
      },
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name,
        stock: product.stock,
        minStock: product.minStock,
        purchasePrice: product.purchasePrice,
        sellPrice: product.sellPrice,
        isActive: product.isActive,
        totalSold: product.saleDetails.reduce(
          (sum, detail) => sum + detail.quantity,
          0
        ),
        totalSales: product.saleDetails.reduce(
          (sum, detail) => sum + detail.subtotal,
          0
        ),
      })),
    };
  }

  private async generateExcelReport(data: any, type: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${type} Report`);

    // Configurar columnas según el tipo de reporte
    if (type === "SALES") {
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Invoice Number", key: "invoiceNumber", width: 20 },
        { header: "Date", key: "createdAt", width: 15 },
        { header: "Total", key: "total", width: 15 },
        { header: "Profit", key: "profit", width: 15 },
        { header: "Is Credit", key: "isCredit", width: 12 },
        { header: "Client", key: "clientName", width: 25 },
        { header: "User", key: "userName", width: 20 },
      ];

      data.data.forEach((sale) => {
        worksheet.addRow({
          id: sale.id,
          invoiceNumber: sale.invoiceNumber,
          createdAt: sale.createdAt.toISOString().split("T")[0],
          total: sale.total,
          profit: sale.profit,
          isCredit: sale.isCredit ? "Yes" : "No",
          clientName: sale.client?.fullName || "N/A",
          userName: sale.user?.fullName || "N/A",
        });
      });
    }

    // Agregar resumen
    const summaryRow = worksheet.addRow([]);
    summaryRow.getCell(1).value = "SUMMARY";
    summaryRow.getCell(1).font = { bold: true };

    Object.entries(data.summary).forEach(([key, value], index) => {
      worksheet.addRow({ [key]: value });
    });

    return workbook.xlsx.writeBuffer() as unknown as Promise<Buffer>;
  }
}
