import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { User } from '../../auth/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
import { Client } from '../../clients/entities/client.entity';
import { SaleDetail } from './sale-detail.entity';

@Entity('sales')
export class Sale extends BaseEntity {
  @Column()
  invoiceNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  profit: number;

  @Column({ default: true })
  isCredit: boolean;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  canceledAt: Date;

  // Relations
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  storeId: number;

  @ManyToOne(() => Store, (store) => store.sales)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ nullable: true })
  clientId: number;

  @ManyToOne(() => Client, (client) => client.sales)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true })
  details: SaleDetail[];
}
