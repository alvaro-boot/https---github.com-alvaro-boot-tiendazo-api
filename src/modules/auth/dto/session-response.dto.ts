import { ApiProperty } from "@nestjs/swagger";

export class SessionResponseDto {
  @ApiProperty({ description: "ID único de la sesión" })
  id: number;

  @ApiProperty({ description: "Token de la sesión" })
  token: string;

  @ApiProperty({ description: "ID del usuario" })
  userId: number;

  @ApiProperty({ description: "Fecha de expiración" })
  expiresAt: Date;

  @ApiProperty({ description: "Dirección IP" })
  ipAddress: string;

  @ApiProperty({ description: "User Agent" })
  userAgent: string;

  @ApiProperty({ description: "Si la sesión está activa" })
  isActive: boolean;

  @ApiProperty({ description: "Última vez que se usó" })
  lastUsedAt: Date;

  @ApiProperty({ description: "Nombre del dispositivo" })
  deviceName: string;

  @ApiProperty({ description: "Tipo de dispositivo" })
  deviceType: string;

  @ApiProperty({ description: "Fecha de creación" })
  createdAt: Date;
}
