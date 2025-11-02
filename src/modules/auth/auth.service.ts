import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan, MoreThan, In } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./entities/user.entity";
import { SessionToken } from "./entities/session-token.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SessionResponseDto } from "./dto/session-response.dto";
import { RevokeSessionDto } from "./dto/revoke-session.dto";
import { SessionStatsDto } from "./dto/session-stats.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SessionToken)
    private sessionTokenRepository: Repository<SessionToken>,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
      relations: ["store"],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Crear registro de sesión en la base de datos
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token válido por 7 días

    const sessionToken = this.sessionTokenRepository.create({
      token: accessToken,
      userId: user.id,
      expiresAt,
      ipAddress: ipAddress || "unknown",
      userAgent: userAgent || "unknown",
      deviceName: this.extractDeviceName(userAgent),
      deviceType: this.extractDeviceType(userAgent),
      lastUsedAt: new Date(),
    });

    await this.sessionTokenRepository.save(sessionToken);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        store: user.store,
      },
      session: {
        id: sessionToken.id,
        expiresAt: sessionToken.expiresAt,
        deviceName: sessionToken.deviceName,
        deviceType: sessionToken.deviceType,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (existingUser) {
      throw new ConflictException("Username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...result } = savedUser;

    return result;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ["store"],
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const { password: _, ...result } = user;
    return result;
  }

  // Métodos para gestión de sesiones
  async getUserSessions(userId: number): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionTokenRepository.find({
      where: { userId, isActive: true },
      order: { lastUsedAt: "DESC" },
    });

    return sessions.map((session) => ({
      id: session.id,
      token: session.token,
      userId: session.userId,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      isActive: session.isActive,
      lastUsedAt: session.lastUsedAt,
      deviceName: session.deviceName,
      deviceType: session.deviceType,
      createdAt: session.createdAt,
    }));
  }

  async revokeSession(sessionId: number, userId: number): Promise<void> {
    const session = await this.sessionTokenRepository.findOne({
      where: { id: sessionId, userId, isActive: true },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    session.isActive = false;
    await this.sessionTokenRepository.save(session);
  }

  async revokeAllSessions(userId: number): Promise<void> {
    await this.sessionTokenRepository.update(
      { userId, isActive: true },
      { isActive: false }
    );
  }

  async revokeMultipleSessions(
    sessionIds: number[],
    userId: number
  ): Promise<void> {
    await this.sessionTokenRepository.update(
      { id: In(sessionIds), userId, isActive: true },
      { isActive: false }
    );
  }

  async updateSessionLastUsed(token: string): Promise<void> {
    await this.sessionTokenRepository.update(
      { token, isActive: true },
      { lastUsedAt: new Date() }
    );
  }

  async validateSessionToken(token: string): Promise<SessionToken | null> {
    const session = await this.sessionTokenRepository.findOne({
      where: { token, isActive: true },
      relations: ["user"],
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Actualizar último uso
    await this.updateSessionLastUsed(token);
    return session;
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.sessionTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  // Métodos auxiliares para extraer información del dispositivo
  private extractDeviceName(userAgent?: string): string {
    if (!userAgent) return "Unknown Device";

    // Lógica simple para extraer nombre del dispositivo
    if (userAgent.includes("Mobile")) return "Mobile Device";
    if (userAgent.includes("Tablet")) return "Tablet";
    if (userAgent.includes("Windows")) return "Windows PC";
    if (userAgent.includes("Mac")) return "Mac";
    if (userAgent.includes("Linux")) return "Linux PC";

    return "Unknown Device";
  }

  private extractDeviceType(userAgent?: string): string {
    if (!userAgent) return "unknown";

    if (userAgent.includes("Mobile")) return "mobile";
    if (userAgent.includes("Tablet")) return "tablet";
    if (
      userAgent.includes("Windows") ||
      userAgent.includes("Mac") ||
      userAgent.includes("Linux")
    )
      return "desktop";

    return "web";
  }

  async getSessionStats(userId: number): Promise<SessionStatsDto> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total de sesiones activas del usuario
    const totalActiveSessions = await this.sessionTokenRepository.count({
      where: { userId, isActive: true },
    });

    // Sesiones por tipo de dispositivo
    const sessionsByDevice = await this.sessionTokenRepository
      .createQueryBuilder("session")
      .select("session.deviceType", "deviceType")
      .addSelect("COUNT(*)", "count")
      .where("session.userId = :userId", { userId })
      .andWhere("session.isActive = :isActive", { isActive: true })
      .groupBy("session.deviceType")
      .getRawMany();

    const sessionsByDeviceType = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
      web: 0,
      unknown: 0,
    };

    sessionsByDevice.forEach((item) => {
      const deviceType = item.deviceType || "unknown";
      if (deviceType in sessionsByDeviceType) {
        sessionsByDeviceType[deviceType] = parseInt(item.count);
      }
    });

    // Sesiones creadas en las últimas 24 horas
    const sessionsLast24h = await this.sessionTokenRepository.count({
      where: {
        userId,
        createdAt: MoreThan(last24h),
      },
    });

    // Sesiones creadas en la última semana
    const sessionsLastWeek = await this.sessionTokenRepository.count({
      where: {
        userId,
        createdAt: MoreThan(lastWeek),
      },
    });

    // Sesiones expiradas
    const expiredSessions = await this.sessionTokenRepository.count({
      where: {
        userId,
        expiresAt: LessThan(now),
        isActive: true,
      },
    });

    return {
      totalActiveSessions,
      sessionsByDeviceType,
      sessionsLast24h,
      sessionsLastWeek,
      expiredSessions,
    };
  }
}
