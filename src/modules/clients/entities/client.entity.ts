import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Sale } from '../../sales/entities/sale.entity';

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

  @OneToMany(() => Sale, (sale) => sale.client)
  sales: Sale[];
}
