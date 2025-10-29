import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../auth/entities/user.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  SALE = 'SALE',
  RETURN = 'RETURN',
}

@Entity('inventory_movements')
export class InventoryMovement extends BaseEntity {
  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.inventoryMovements)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalValue: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  reference: string; // Número de factura, orden, etc.

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.inventoryMovements)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  previousStock: number;

  @Column({ type: 'int' })
  newStock: number;
}
