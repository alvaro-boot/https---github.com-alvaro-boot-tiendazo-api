import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "../entities/user.entity";
import { SessionToken } from "../entities/session-token.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SessionToken)
    private sessionTokenRepository: Repository<SessionToken>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // Ignorar expiración del JWT, verificamos la sesión en BD
      secretOrKey: configService.get("JWT_SECRET"),
      passReqToCallback: true, // Necesario para acceder al request completo
    });
  }

  async validate(req: Request, payload: any) {
    // Extraer el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid authorization header");
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Validar que el token existe en la base de datos y está activo
    const session = await this.sessionTokenRepository.findOne({
      where: {
        token: token,
        isActive: true,
      },
      relations: ["user"],
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    // Actualizar último uso de la sesión
    session.lastUsedAt = new Date();
    await this.sessionTokenRepository.save(session);

    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
      relations: ["store"],
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}
