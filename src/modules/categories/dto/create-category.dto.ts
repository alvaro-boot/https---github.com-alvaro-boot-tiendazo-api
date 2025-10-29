import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
}
