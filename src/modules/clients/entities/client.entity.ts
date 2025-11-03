import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { DebtPayment } from '../../debts/entities/debt-payment.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('clients')
export class Client extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  debt: number;

  @Column({ nullable: true })
  storeId: number;

  @ManyToOne(() => Store, (store) => store.clients, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @OneToMany(() => Sale, (sale) => sale.client)
  sales: Sale[];

  @OneToMany(() => DebtPayment, (payment) => payment.client)
  debtPayments: DebtPayment[];
}
