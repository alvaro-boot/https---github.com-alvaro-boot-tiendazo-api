import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { SessionToken } from "../entities/session-token.entity";

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(
    @InjectRepository(SessionToken)
    private sessionTokenRepository: Repository<SessionToken>
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions() {
    try {
      const result = await this.sessionTokenRepository.delete({
        expiresAt: LessThan(new Date()),
      });

      if (result.affected && result.affected > 0) {
        this.logger.log(`Cleaned up ${result.affected} expired sessions`);
      }
    } catch (error) {
      this.logger.error("Error cleaning up expired sessions:", error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupInactiveSessions() {
    try {
      // Eliminar sesiones inactivas por más de 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.sessionTokenRepository.delete({
        lastUsedAt: LessThan(thirtyDaysAgo),
        isActive: false,
      });

      if (result.affected && result.affected > 0) {
        this.logger.log(`Cleaned up ${result.affected} inactive sessions`);
      }
    } catch (error) {
      this.logger.error("Error cleaning up inactive sessions:", error);
    }
  }
}
