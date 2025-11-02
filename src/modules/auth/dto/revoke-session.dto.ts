import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsArray } from "class-validator";

export class RevokeSessionDto {
  @ApiProperty({
    description: "ID de la sesión a revocar",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sessionId?: number;

  @ApiProperty({
    description: "Array de IDs de sesiones a revocar",
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  sessionIds?: number[];
}
