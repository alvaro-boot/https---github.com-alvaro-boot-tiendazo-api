import { ApiProperty } from "@nestjs/swagger";

export class SessionStatsDto {
  @ApiProperty({ description: "Total de sesiones activas" })
  totalActiveSessions: number;

  @ApiProperty({ description: "Sesiones por tipo de dispositivo" })
  sessionsByDeviceType: {
    desktop: number;
    mobile: number;
    tablet: number;
    web: number;
    unknown: number;
  };

  @ApiProperty({ description: "Sesiones creadas en las últimas 24 horas" })
  sessionsLast24h: number;

  @ApiProperty({ description: "Sesiones creadas en la última semana" })
  sessionsLastWeek: number;

  @ApiProperty({ description: "Sesiones expiradas pendientes de limpieza" })
  expiredSessions: number;
}
