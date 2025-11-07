import { PartialType } from "@nestjs/swagger";
import { CreateElectronicInvoiceDto } from "./create-electronic-invoice.dto";

export class UpdateElectronicInvoiceDto extends PartialType(CreateElectronicInvoiceDto) {}

