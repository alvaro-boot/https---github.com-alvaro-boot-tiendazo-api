import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Delete,
  Param,
  ParseIntPipe,
  UnauthorizedException,
  Patch,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RevokeSessionDto } from "./dto/revoke-session.dto";
import { SessionStatsDto } from "./dto/session-stats.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { Public } from "../../core/decorators/public.decorator";
import { AuthUser } from "../../core/decorators/auth-user.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({ summary: "Login" })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register new user" })
  async register(@Body() registerDto: RegisterDto) {
    try {
      console.log("📤 Recibida petición para registrar usuario:", {
        ...registerDto,
        password: "***",
      });
      const user = await this.authService.register(registerDto);
      console.log("✅ Usuario registrado exitosamente en el controlador:", user);
      return user;
    } catch (error) {
      console.error("❌ Error en el controlador al registrar usuario:", error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  async getProfile(@AuthUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("sessions")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user active sessions" })
  async getUserSessions(@AuthUser() user: any) {
    return this.authService.getUserSessions(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("sessions/:sessionId")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke specific session" })
  async revokeSession(
    @Param("sessionId", ParseIntPipe) sessionId: number,
    @AuthUser() user: any
  ) {
    await this.authService.revokeSession(sessionId, user.id);
    return { message: "Session revoked successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("sessions")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke multiple sessions or all sessions" })
  async revokeSessions(
    @Body() revokeSessionDto: RevokeSessionDto,
    @AuthUser() user: any
  ) {
    if (revokeSessionDto.sessionIds && revokeSessionDto.sessionIds.length > 0) {
      await this.authService.revokeMultipleSessions(
        revokeSessionDto.sessionIds,
        user.id
      );
      return { message: "Selected sessions revoked successfully" };
    } else {
      await this.authService.revokeAllSessions(user.id);
      return { message: "All sessions revoked successfully" };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete("sessions/all")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke all user sessions" })
  async revokeAllSessions(@AuthUser() user: any) {
    await this.authService.revokeAllSessions(user.id);
    return { message: "All sessions revoked successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("sessions/stats")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get session statistics for user" })
  async getSessionStats(@AuthUser() user: any): Promise<SessionStatsDto> {
    return this.authService.getSessionStats(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("refresh")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Refresh current session token" })
  async refreshSession(@Request() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid authorization header");
    }
    const token = authHeader.substring(7);
    return this.authService.refreshSession(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get("users")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users (Admin only)" })
  async getAllUsers(@AuthUser() user: any) {
    if (user.role !== "ADMIN") {
      throw new UnauthorizedException("Only admins can access this endpoint");
    }
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Patch("users/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user (Admin only)" })
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: Partial<RegisterDto>,
    @AuthUser() user: any
  ) {
    if (user.role !== "ADMIN") {
      throw new UnauthorizedException("Only admins can update users");
    }
    return this.authService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("users/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user (Admin only)" })
  async deleteUser(
    @Param("id", ParseIntPipe) id: number,
    @AuthUser() user: any
  ) {
    if (user.role !== "ADMIN") {
      throw new UnauthorizedException("Only admins can delete users");
    }
    if (user.id === id) {
      throw new UnauthorizedException("Cannot delete your own account");
    }
    await this.authService.deleteUser(id);
    return { message: "User deleted successfully" };
  }
}
