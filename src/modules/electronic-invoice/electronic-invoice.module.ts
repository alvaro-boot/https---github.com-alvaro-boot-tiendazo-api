import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ElectronicInvoiceService } from "./electronic-invoice.service";
import { ElectronicInvoiceController } from "./electronic-invoice.controller";
import { ElectronicInvoice } from "./entities/electronic-invoice.entity";
import { Store } from "../stores/entities/store.entity";
import { Sale } from "../sales/entities/sale.entity";
import { Order } from "../orders/entities/order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ElectronicInvoice,
      Store,
      Sale,
      Order,
    ]),
  ],
  controllers: [ElectronicInvoiceController],
  providers: [ElectronicInvoiceService],
  exports: [ElectronicInvoiceService],
})
export class ElectronicInvoiceModule {}

