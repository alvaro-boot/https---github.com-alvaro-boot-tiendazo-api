import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../shared/base.entity';
import { Store } from '../../stores/entities/store.entity';

export enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

@Entity('accounting_reports')
@Index(['storeId', 'period', 'startDate'])
export class AccountingReport extends BaseEntity {
  @Column()
  storeId: number;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({
    type: 'enum',
    enum: ReportPeriod,
  })
  period: ReportPeriod;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  // Totales
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalIncome: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpenses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  netProfit: number; // Ingresos - Egresos

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalTax: number; // IVA recaudado

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashFlow: number; // Flujo de caja

  // Contadores
  @Column({ default: 0 })
  salesCount: number;

  @Column({ default: 0 })
  expensesCount: number;

  // Archivos generados
  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ nullable: true })
  excelUrl: string;

  @Column({ nullable: true, type: 'text' })
  metadata: string; // JSON con datos adicionales
}

