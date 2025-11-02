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
    return this.authService.register(registerDto);
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
}
