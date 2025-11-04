import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Store } from '../../stores/entities/store.entity';
import { User } from '../../auth/entities/user.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Order } from '../../orders/entities/order.entity';

export enum EntryType {
  INCOME = 'INCOME', // Ingreso
  EXPENSE = 'EXPENSE', // Egreso
}

export enum EntryCategory {
  // Ingresos
  SALES = 'SALES', // Ventas
  ONLINE_SALES = 'ONLINE_SALES', // Ventas online
  OTHER_INCOME = 'OTHER_INCOME', // Otros ingresos

  // Egresos
  PURCHASES = 'PURCHASES', // Compras de productos
  RENT = 'RENT', // Arriendo
  SERVICES = 'SERVICES', // Servicios públicos
  SUPPLIERS = 'SUPPLIERS', // Proveedores
  SALARIES = 'SALARIES', // Salarios
  TAXES = 'TAXES', // Impuestos
  SHIPPING = 'SHIPPING', // Envíos
  OTHER_EXPENSE = 'OTHER_EXPENSE', // Otros gastos
}

@Entity('accounting_entries')
@Index(['storeId', 'date'])
@Index(['type', 'category'])
export class AccountingEntry extends BaseEntity {
  @Column()
  storeId: number;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({
    type: 'enum',
    enum: EntryType,
  })
  type: EntryType;

  @Column({
    type: 'enum',
    enum: EntryCategory,
  })
  category: EntryCategory;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number; // IVA u otros impuestos

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  netAmount: number; // Monto neto (amount - tax)

  @Column({ nullable: true })
  currency: string;

  // Referencias a otras entidades
  @Column({ nullable: true })
  saleId: number;

  @ManyToOne(() => Sale, { nullable: true })
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @Column({ nullable: true })
  orderId: number;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  userId: number; // Usuario que registró el movimiento

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ nullable: true })
  invoiceNumber: string; // Número de factura asociada

  @Column({ nullable: true })
  receiptNumber: string; // Número de recibo asociado
}

