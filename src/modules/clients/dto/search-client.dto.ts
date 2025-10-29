import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SearchClientDto {
  @ApiProperty({ example: "Juan", required: false })
  @IsString()
  @IsOptional()
  q?: string;
}
