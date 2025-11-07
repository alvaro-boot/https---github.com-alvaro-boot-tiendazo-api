import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElectronicInvoice, InvoiceStatus, InvoiceProvider } from "./entities/electronic-invoice.entity";
import { Store } from "../stores/entities/store.entity";
import { Sale } from "../sales/entities/sale.entity";
import { Order } from "../orders/entities/order.entity";
import { CreateElectronicInvoiceDto } from "./dto/create-electronic-invoice.dto";
import { UpdateElectronicInvoiceDto } from "./dto/update-electronic-invoice.dto";

@Injectable()
export class ElectronicInvoiceService {
  constructor(
    @InjectRepository(ElectronicInvoice)
    private invoiceRepository: Repository<ElectronicInvoice>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createDto: CreateElectronicInvoiceDto): Promise<ElectronicInvoice> {
    // Verificar que la tienda existe y tiene facturación electrónica habilitada
    const store = await this.storeRepository.findOne({
      where: { id: createDto.storeId },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${createDto.storeId} not found`);
    }

    if (!store.electronicInvoiceEnabled) {
      throw new BadRequestException("Electronic invoicing is not enabled for this store");
    }

    // Obtener el consecutivo de factura
    const invoiceNumber = await this.generateInvoiceNumber(createDto.storeId);

    // Si hay una venta o pedido asociado, obtener información del cliente
    let customerName = createDto.customerName;
    let customerIdType = createDto.customerIdType;
    let customerIdNumber = createDto.customerIdNumber;
    let customerEmail = createDto.customerEmail;
    let customerAddress = createDto.customerAddress;
    let customerPhone = createDto.customerPhone;

    if (createDto.saleId) {
      const sale = await this.saleRepository.findOne({
        where: { id: createDto.saleId },
        relations: ["client"],
      });

      if (sale && sale.client) {
        customerName = sale.client.fullName;
        customerIdNumber = sale.client.phone || customerIdNumber;
        customerEmail = sale.client.email || customerEmail;
        customerAddress = sale.client.address || customerAddress;
        customerPhone = sale.client.phone || customerPhone;
      }
    }

    if (createDto.orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: createDto.orderId },
        relations: ["client"],
      });

      if (order && order.client) {
        customerName = order.client.fullName;
        customerIdNumber = order.client.phone || customerIdNumber;
        customerEmail = order.client.email || customerEmail;
        customerAddress = order.client.address || customerAddress;
        customerPhone = order.client.phone || customerPhone;
      }
    }

    // Crear la factura
    const invoice = this.invoiceRepository.create({
      invoiceNumber,
      storeId: createDto.storeId,
      saleId: createDto.saleId,
      orderId: createDto.orderId,
      userId: createDto.userId,
      customerName,
      customerIdType: customerIdType || "CC",
      customerIdNumber,
      customerEmail,
      customerAddress,
      customerPhone,
      subtotal: createDto.subtotal,
      tax: createDto.tax || 0,
      total: createDto.total,
      invoiceDate: createDto.invoiceDate || new Date(),
      dueDate: createDto.dueDate || new Date(),
      provider: store.electronicInvoiceProvider as InvoiceProvider,
      status: InvoiceStatus.PENDING,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Generar factura electrónica con el proveedor
    if (store.electronicInvoiceProvider) {
      await this.generateElectronicInvoice(savedInvoice, store);
    }

    return savedInvoice;
  }

  async findAll(storeId?: number): Promise<ElectronicInvoice[]> {
    const where = storeId ? { storeId } : {};
    return await this.invoiceRepository.find({
      where,
      relations: ["store", "sale", "order"],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<ElectronicInvoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ["store", "sale", "order", "user"],
    });

    if (!invoice) {
      throw new NotFoundException(`Electronic invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<ElectronicInvoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ["store", "sale", "order"],
    });

    if (!invoice) {
      throw new NotFoundException(`Electronic invoice with number ${invoiceNumber} not found`);
    }

    return invoice;
  }

  async update(id: number, updateDto: UpdateElectronicInvoiceDto): Promise<ElectronicInvoice> {
    const invoice = await this.findOne(id);

    Object.assign(invoice, updateDto);

    return await this.invoiceRepository.save(invoice);
  }

  async delete(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoiceRepository.remove(invoice);
  }

  // Generar número de factura consecutivo
  private async generateInvoiceNumber(storeId: number): Promise<string> {
    const lastInvoice = await this.invoiceRepository.findOne({
      where: { storeId },
      order: { invoiceNumber: "DESC" },
    });

    if (!lastInvoice) {
      // Primera factura: 0001
      return "0001";
    }

    const lastNumber = parseInt(lastInvoice.invoiceNumber, 10);
    const nextNumber = lastNumber + 1;
    return nextNumber.toString().padStart(4, "0");
  }

  // Generar factura electrónica con el proveedor
  private async generateElectronicInvoice(
    invoice: ElectronicInvoice,
    store: Store,
  ): Promise<void> {
    // TODO: Implementar integración con proveedores tecnológicos
    // Por ahora, solo marcamos como generada
    invoice.status = InvoiceStatus.GENERATED;
    await this.invoiceRepository.save(invoice);

    // Aquí iría la lógica de integración con:
    // - Alegra API
    // - Siigo API
    // - Facturatech API
    // - Gosocket API
    // - DIAN API directa
  }

  // Enviar factura al cliente por email
  async sendToCustomer(id: number): Promise<void> {
    const invoice = await this.findOne(id);

    if (invoice.status !== InvoiceStatus.GENERATED) {
      throw new BadRequestException("Invoice must be generated before sending");
    }

    if (!invoice.customerEmail) {
      throw new BadRequestException("Customer email is required");
    }

    // TODO: Implementar envío de email con XML y PDF adjuntos

    invoice.status = InvoiceStatus.SENT;
    invoice.sentAt = new Date();
    await this.invoiceRepository.save(invoice);
  }
}

