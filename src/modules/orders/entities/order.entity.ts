import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Store } from '../../stores/entities/store.entity';
import { User } from '../../auth/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING', // Pendiente de pago
  PAID = 'PAID', // Pagado
  PROCESSING = 'PROCESSING', // En proceso
  SHIPPED = 'SHIPPED', // Enviado
  DELIVERED = 'DELIVERED', // Entregado
  CANCELLED = 'CANCELLED', // Cancelado
  REFUNDED = 'REFUNDED', // Reembolsado
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  ONLINE = 'ONLINE', // Pago online (Wompi, ePayco, etc.)
  OTHER = 'OTHER',
}

@Entity('orders')
@Index(['storeId', 'status'])
@Index(['clientId'])
@Index(['orderNumber'], { unique: true })
export class Order extends BaseEntity {
  @Column({ unique: true })
  orderNumber: string;

  @Column()
  storeId: number;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ nullable: true })
  userId: number; // Usuario que creó el pedido (empleado)

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  clientId: number; // Cliente que hizo el pedido

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ nullable: true })
  currency: string;

  // Información de envío
  @Column({ nullable: true })
  shippingAddress: string;

  @Column({ nullable: true })
  shippingCity: string;

  @Column({ nullable: true })
  shippingState: string;

  @Column({ nullable: true })
  shippingZipCode: string;

  @Column({ nullable: true })
  shippingCountry: string;

  @Column({ nullable: true })
  shippingPhone: string;

  @Column({ nullable: true })
  shippingName: string;

  // Información de pago online
  @Column({ nullable: true })
  paymentGatewayTransactionId: string;

  @Column({ nullable: true, type: 'text' })
  paymentGatewayResponse: string; // JSON con respuesta del gateway

  @Column({ nullable: true })
  paymentGatewaySessionUrl: string; // URL de la sesión de pago

  // Facturación electrónica
  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ nullable: true })
  invoiceXml: string; // URL o path del XML

  @Column({ nullable: true })
  invoicePdf: string; // URL o path del PDF

  @Column({ nullable: true })
  invoiceCufe: string; // CUFE de la factura electrónica

  // Tracking
  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  trackingUrl: string;

  // Notas
  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true, type: 'text' })
  internalNotes: string; // Notas internas para el administrador

  // Relaciones
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}

