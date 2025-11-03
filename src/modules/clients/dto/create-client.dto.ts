import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
  ValidateIf,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";

export class CreateClientDto {
  @ApiProperty({ example: "Juan Pérez" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: "juan@example.com", required: false })
  @Transform(({ value }) => (value === "" || value === null ? undefined : value))
  @ValidateIf((o) => o.email !== undefined && o.email !== null && o.email !== "")
  @IsEmail({}, { message: "El email debe ser válido" })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: "+1234567890" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: "Calle 123, Ciudad", required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 0, default: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  debt?: number;
}
