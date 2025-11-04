import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { AccountingEntry } from './entities/accounting-entry.entity';
import { AccountingReport } from './entities/accounting-report.entity';
import { Store } from '../stores/entities/store.entity';
import { Sale } from '../sales/entities/sale.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountingEntry,
      AccountingReport,
      Store,
      Sale,
      Order,
    ]),
  ],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}

