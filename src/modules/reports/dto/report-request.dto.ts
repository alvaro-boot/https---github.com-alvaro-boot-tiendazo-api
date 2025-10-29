import { IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ReportType {
  SALES = 'SALES',
  INVENTORY = 'INVENTORY',
  DEBTS = 'DEBTS',
  PROFITS = 'PROFITS',
  CLIENTS = 'CLIENTS',
  PRODUCTS = 'PRODUCTS',
}

export class ReportRequestDto {
  @ApiProperty({ enum: ReportType, example: ReportType.SALES })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2025-01-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  storeId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  clientId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  productId?: number;

  @ApiProperty({ example: 'excel', required: false })
  @IsOptional()
  format?: 'json' | 'excel';
}
