import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { StoreThemesService } from "./store-themes.service";
import { CreateStoreThemeDto } from "./dto/create-store-theme.dto";
import { UpdateStoreThemeDto } from "./dto/update-store-theme.dto";
import { StoreTheme } from "./entities/store-theme.entity";

@ApiTags("Store Themes")
@Controller("stores/:storeId/themes")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StoreThemesController {
  constructor(private readonly themesService: StoreThemesService) {}

  @Post()
  @ApiOperation({ summary: "Create store theme" })
  @ApiResponse({ status: 201, description: "Theme created successfully" })
  async create(
    @Param("storeId") storeId: number,
    @Body() createThemeDto: CreateStoreThemeDto,
    @Request() req: any,
  ): Promise<StoreTheme> {
    // TODO: Verificar que el usuario tiene permiso para esta tienda
    return await this.themesService.create(+storeId, createThemeDto);
  }

  @Get()
  @ApiOperation({ summary: "Get store theme" })
  @ApiResponse({ status: 200, description: "Theme retrieved successfully" })
  async findOne(@Param("storeId") storeId: number): Promise<StoreTheme> {
    return await this.themesService.findOneOrCreate(+storeId);
  }

  @Put()
  @ApiOperation({ summary: "Update store theme" })
  @ApiResponse({ status: 200, description: "Theme updated successfully" })
  async update(
    @Param("storeId") storeId: number,
    @Body() updateThemeDto: UpdateStoreThemeDto,
  ): Promise<StoreTheme> {
    return await this.themesService.update(+storeId, updateThemeDto);
  }

  @Post("verify-domain")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify custom domain" })
  @ApiResponse({ status: 200, description: "Domain verification status" })
  async verifyDomain(@Param("storeId") storeId: number): Promise<{ verified: boolean }> {
    const verified = await this.themesService.verifyDomain(+storeId);
    return { verified };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete store theme" })
  @ApiResponse({ status: 204, description: "Theme deleted successfully" })
  async remove(@Param("storeId") storeId: number): Promise<void> {
    await this.themesService.delete(+storeId);
  }

  @Post("render")
  @ApiOperation({ summary: "Render store page with template" })
  @ApiResponse({ status: 200, description: "Page rendered successfully" })
  async renderPage(
    @Param("storeId") storeId: number,
    @Body() renderData: any,
  ): Promise<{ html: string; css: string; metadata: any }> {
    const result = await this.themesService.renderStorePage(+storeId, renderData);
    return result;
  }
}

