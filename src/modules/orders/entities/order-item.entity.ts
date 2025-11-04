import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
@Index(['orderId'])
@Index(['productId'])
export class OrderItem extends BaseEntity {
  @Column()
  orderId: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productName: string; // Snapshot del nombre del producto

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number; // Precio al momento de la venta

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number; // Precio de compra para calcular ganancia

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}

