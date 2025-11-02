import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateCategoryDto {
  @ApiProperty({ example: "Electrónicos" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Productos electrónicos y tecnología",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  storeId: number;
}
