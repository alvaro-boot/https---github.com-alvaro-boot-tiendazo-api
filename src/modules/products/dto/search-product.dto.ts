import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SearchProductDto {
  @ApiProperty({ example: "iPhone", required: false })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  storeId?: number;
}
