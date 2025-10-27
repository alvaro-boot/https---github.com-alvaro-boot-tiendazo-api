import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetail])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SalesModule {}
