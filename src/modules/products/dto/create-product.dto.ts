import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty({ example: "iPhone 15" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Smartphone de última generación", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 800000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchasePrice: number;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellPrice: number;

  @ApiProperty({ example: 50, default: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 5, default: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minStock?: number;

  @ApiProperty({ example: "1234567890123", required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  storeId: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isPublic?: boolean;
}
