import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Store } from "../../stores/entities/store.entity";
import { Sale } from "../../sales/entities/sale.entity";
import { Order } from "../../orders/entities/order.entity";
import { User } from "../../auth/entities/user.entity";

export enum InvoiceProvider {
  ALEGRA = "ALEGRA",
  SIIGO = "SIIGO",
  FACTURATECH = "FACTURATECH",
  GOSOCKET = "GOSOCKET",
  DIAN_API = "DIAN_API",
}

export enum InvoiceStatus {
  PENDING = "PENDING", // Pendiente de generar
  GENERATED = "GENERATED", // Generada
  SENT = "SENT", // Enviada al cliente
  ACCEPTED = "ACCEPTED", // Aceptada por DIAN
  REJECTED = "REJECTED", // Rechazada por DIAN
  CANCELLED = "CANCELLED", // Anulada
}

@Entity("electronic_invoices")
@Index(["storeId", "status"])
@Index(["invoiceNumber"], { unique: true })
@Index(["cufe"])
export class ElectronicInvoice extends BaseEntity {
  @Column({ unique: true })
  invoiceNumber: string; // Número consecutivo de factura

  @Column()
  storeId: number;

  @ManyToOne(() => Store, { onDelete: "CASCADE" })
  @JoinColumn({ name: "storeId" })
  store: Store;

  @Column({ nullable: true })
  saleId: number; // Venta asociada (si es POS)

  @ManyToOne(() => Sale, { nullable: true })
  @JoinColumn({ name: "saleId" })
  sale: Sale;

  @Column({ nullable: true })
  orderId: number; // Pedido asociado (si es online)

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: "orderId" })
  order: Order;

  @Column({ nullable: true })
  userId: number; // Usuario que generó la factura

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: User;

  // Información del cliente
  @Column()
  customerName: string;

  @Column()
  customerIdType: string; // CC, NIT, CE, etc.

  @Column()
  customerIdNumber: string;

  @Column({ nullable: true })
  customerEmail: string;

  @Column({ nullable: true })
  customerAddress: string;

  @Column({ nullable: true })
  customerPhone: string;

  // Información de la factura
  @Column({ type: "decimal", precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  tax: number; // IVA

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @Column({ type: "date" })
  invoiceDate: Date;

  @Column({ type: "date" })
  dueDate: Date;

  // Proveedor tecnológico
  @Column({
    type: "enum",
    enum: InvoiceProvider,
    nullable: true,
  })
  provider: InvoiceProvider;

  @Column({
    type: "enum",
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  // CUFE (Código Único de Facturación Electrónica)
  @Column({ nullable: true, unique: true })
  cufe: string; // Código único de la DIAN

  @Column({ nullable: true })
  qrCode: string; // Código QR de la factura

  // Archivos
  @Column({ nullable: true, type: "text" })
  xmlContent: string; // Contenido XML de la factura

  @Column({ nullable: true })
  xmlUrl: string; // URL del XML almacenado

  @Column({ nullable: true })
  pdfUrl: string; // URL del PDF almacenado

  // Respuesta del proveedor
  @Column({ nullable: true, type: "text" })
  providerResponse: string; // JSON con respuesta del proveedor

  @Column({ nullable: true })
  providerInvoiceId: string; // ID de factura en el proveedor

  @Column({ nullable: true, type: "text" })
  rejectionReason: string; // Razón de rechazo si fue rechazada

  // Fechas importantes
  @Column({ nullable: true })
  sentAt: Date; // Fecha de envío al cliente

  @Column({ nullable: true })
  acceptedAt: Date; // Fecha de aceptación por DIAN

  @Column({ nullable: true })
  rejectedAt: Date; // Fecha de rechazo
}

