import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementType } from '../entities/inventory-movement.entity';

export class CreateInventoryMovementDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ enum: MovementType, example: MovementType.IN })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 50000, required: false })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({ example: 'Compra de mercancía', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ example: 'FAC-001', required: false })
  @IsString()
  @IsOptional()
  reference?: string;
}
