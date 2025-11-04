import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  storeId: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ONLINE })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  // Información de envío
  @ApiProperty({ example: 'Calle 123 #45-67', required: false })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ example: 'Bogotá', required: false })
  @IsString()
  @IsOptional()
  shippingCity?: string;

  @ApiProperty({ example: 'Cundinamarca', required: false })
  @IsString()
  @IsOptional()
  shippingState?: string;

  @ApiProperty({ example: '110111', required: false })
  @IsString()
  @IsOptional()
  shippingZipCode?: string;

  @ApiProperty({ example: 'Colombia', required: false })
  @IsString()
  @IsOptional()
  shippingCountry?: string;

  @ApiProperty({ example: '+57 300 1234567', required: false })
  @IsString()
  @IsOptional()
  shippingPhone?: string;

  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsString()
  @IsOptional()
  shippingName?: string;

  @ApiProperty({ example: 'Notas del pedido', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

