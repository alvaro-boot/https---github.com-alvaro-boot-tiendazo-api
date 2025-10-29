import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../auth/entities/user.entity';

export enum PaymentType {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
  OTHER = 'OTHER',
}

@Entity('debt_payments')
export class DebtPayment extends BaseEntity {
  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.debtPayments)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.CASH })
  paymentType: PaymentType;

  @Column({ nullable: true })
  reference: string; // Número de comprobante, transferencia, etc.

  @Column({ nullable: true })
  notes: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.debtPayments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  previousDebt: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  newDebt: number;
}
