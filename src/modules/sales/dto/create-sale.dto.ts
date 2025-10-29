import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSaleDetailDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  unitPrice: number;
}

export class CreateSaleDto {
  @ApiProperty({ example: 'FAC-001' })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  total: number;

  @ApiProperty({ example: true, default: false })
  @IsBoolean()
  @IsOptional()
  isCredit?: boolean;

  @ApiProperty({ example: 'Venta al contado', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  storeId: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  clientId?: number;

  @ApiProperty({ type: [CreateSaleDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  details: CreateSaleDetailDto[];
}
