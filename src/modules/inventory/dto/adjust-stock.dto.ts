import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AdjustStockDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Type(() => Number)
  newStock: number;

  @ApiProperty({ example: 'Ajuste de inventario por conteo físico', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
