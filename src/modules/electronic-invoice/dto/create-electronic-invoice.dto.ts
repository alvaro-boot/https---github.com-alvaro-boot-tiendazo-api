import { IsNumber, IsString, IsOptional, IsEmail, IsDateString, IsEnum, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InvoiceProvider } from "../entities/electronic-invoice.entity";

export class CreateElectronicInvoiceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  storeId: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  saleId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  orderId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({ example: "Juan Pérez" })
  @IsString()
  customerName: string;

  @ApiProperty({ example: "CC", required: false })
  @IsString()
  @IsOptional()
  customerIdType?: string;

  @ApiProperty({ example: "1234567890" })
  @IsString()
  customerIdNumber: string;

  @ApiProperty({ example: "cliente@example.com", required: false })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({ example: "Calle 123 #45-67", required: false })
  @IsString()
  @IsOptional()
  customerAddress?: string;

  @ApiProperty({ example: "+57 300 123 4567", required: false })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ example: 19000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tax?: number;

  @ApiProperty({ example: 119000 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: "2024-01-01", required: false })
  @IsDateString()
  @IsOptional()
  invoiceDate?: string;

  @ApiProperty({ example: "2024-01-15", required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

