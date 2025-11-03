import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class SearchClientDto {
  @ApiProperty({ example: "Juan", required: false })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  storeId?: number;
}
