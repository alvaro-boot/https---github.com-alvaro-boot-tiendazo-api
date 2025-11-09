import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StoreTheme, StoreTemplate } from "./entities/store-theme.entity";
import { Store } from "./entities/store.entity";
import { CreateStoreThemeDto } from "./dto/create-store-theme.dto";
import { UpdateStoreThemeDto } from "./dto/update-store-theme.dto";
import { TemplateFactory } from "./templates/template-factory";
import { TemplateRenderData, TemplateRenderResult } from "./templates/base-template";

@Injectable()
export class StoreThemesService {
  constructor(
    @InjectRepository(StoreTheme)
    private themeRepository: Repository<StoreTheme>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  private async renderAndPersistMarkup(
    storeId: number,
    renderData: TemplateRenderData = {},
  ): Promise<TemplateRenderResult> {
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const theme = await this.findOneOrCreate(storeId);
    const template = TemplateFactory.getTemplate(theme.template);
    const result = template.render(store, theme, renderData);

    theme.generatedHtml = result.html;
    theme.generatedCss = result.css;
    await this.themeRepository.save(theme);

    return result;
  }

  async create(storeId: number, createThemeDto: CreateStoreThemeDto): Promise<StoreTheme> {
    // Verificar que la tienda existe
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    // Verificar si ya existe un tema para esta tienda
    const existingTheme = await this.themeRepository.findOne({
      where: { storeId },
    });

    if (existingTheme) {
      throw new Error("Theme already exists for this store. Use update instead.");
    }

    // Crear tema con valores por defecto
    const theme = this.themeRepository.create({
      storeId,
      template: createThemeDto.template || StoreTemplate.MODERN,
      primaryColor: createThemeDto.primaryColor || "#3B82F6",
      secondaryColor: createThemeDto.secondaryColor || "#8B5CF6",
      accentColor: createThemeDto.accentColor || "#10B981",
      backgroundColor: createThemeDto.backgroundColor || "#FFFFFF",
      textColor: createThemeDto.textColor || "#1F2937",
      fontFamily: createThemeDto.fontFamily || "Inter",
      headingFont: createThemeDto.headingFont || "Inter",
      bodyFont: createThemeDto.bodyFont || "Inter",
      favicon: createThemeDto.favicon,
      customBanner: createThemeDto.customBanner,
      showReviews: createThemeDto.showReviews ?? true,
      showFeatured: createThemeDto.showFeatured ?? true,
      showCategories: createThemeDto.showCategories ?? true,
      showContact: createThemeDto.showContact ?? true,
      showBlog: createThemeDto.showBlog ?? false,
      layoutConfig: createThemeDto.layoutConfig
        ? JSON.stringify(createThemeDto.layoutConfig)
        : null,
      customDomain: createThemeDto.customDomain,
      subdomain: createThemeDto.subdomain,
      googleAnalyticsId: createThemeDto.googleAnalyticsId,
      facebookPixelId: createThemeDto.facebookPixelId,
      mailchimpListId: createThemeDto.mailchimpListId,
    });

    const savedTheme = await this.themeRepository.save(theme);

    return savedTheme;
  }

  async findOne(storeId: number): Promise<StoreTheme | null> {
    return await this.themeRepository.findOne({
      where: { storeId },
      relations: ["store"],
    });
  }

  async findOneOrCreate(storeId: number): Promise<StoreTheme> {
    let theme = await this.findOne(storeId);

    if (!theme) {
      // Crear tema por defecto si no existe
      theme = await this.create(storeId, {});
    }

    return theme;
  }

  async update(
    storeId: number,
    updateThemeDto: UpdateStoreThemeDto,
  ): Promise<StoreTheme> {
    const theme = await this.findOne(storeId);

    if (!theme) {
      // Crear tema si no existe
      const created = await this.create(storeId, updateThemeDto as CreateStoreThemeDto);
      // Limpiar el HTML generado para forzar una regeneración con los datos más recientes
      created.generatedHtml = null;
      created.generatedCss = null;
      await this.themeRepository.save(created);
      return created;
    }

    // Actualizar campos
    if (updateThemeDto.template !== undefined) {
      theme.template = updateThemeDto.template;
    }
    if (updateThemeDto.primaryColor !== undefined) {
      theme.primaryColor = updateThemeDto.primaryColor;
    }
    if (updateThemeDto.secondaryColor !== undefined) {
      theme.secondaryColor = updateThemeDto.secondaryColor;
    }
    if (updateThemeDto.accentColor !== undefined) {
      theme.accentColor = updateThemeDto.accentColor;
    }
    if (updateThemeDto.backgroundColor !== undefined) {
      theme.backgroundColor = updateThemeDto.backgroundColor;
    }
    if (updateThemeDto.textColor !== undefined) {
      theme.textColor = updateThemeDto.textColor;
    }
    if (updateThemeDto.fontFamily !== undefined) {
      theme.fontFamily = updateThemeDto.fontFamily;
    }
    if (updateThemeDto.headingFont !== undefined) {
      theme.headingFont = updateThemeDto.headingFont;
    }
    if (updateThemeDto.bodyFont !== undefined) {
      theme.bodyFont = updateThemeDto.bodyFont;
    }
    if (updateThemeDto.favicon !== undefined) {
      theme.favicon = updateThemeDto.favicon;
    }
    if (updateThemeDto.customBanner !== undefined) {
      theme.customBanner = updateThemeDto.customBanner;
    }
    if (updateThemeDto.showReviews !== undefined) {
      theme.showReviews = updateThemeDto.showReviews;
    }
    if (updateThemeDto.showFeatured !== undefined) {
      theme.showFeatured = updateThemeDto.showFeatured;
    }
    if (updateThemeDto.showCategories !== undefined) {
      theme.showCategories = updateThemeDto.showCategories;
    }
    if (updateThemeDto.showContact !== undefined) {
      theme.showContact = updateThemeDto.showContact;
    }
    if (updateThemeDto.showBlog !== undefined) {
      theme.showBlog = updateThemeDto.showBlog;
    }
    if (updateThemeDto.layoutConfig !== undefined) {
      theme.layoutConfig = JSON.stringify(updateThemeDto.layoutConfig);
    }
    if (updateThemeDto.customDomain !== undefined) {
      theme.customDomain = updateThemeDto.customDomain;
      theme.domainVerified = false; // Reiniciar verificación al cambiar dominio
    }
    if (updateThemeDto.subdomain !== undefined) {
      theme.subdomain = updateThemeDto.subdomain;
    }
    if (updateThemeDto.googleAnalyticsId !== undefined) {
      theme.googleAnalyticsId = updateThemeDto.googleAnalyticsId;
    }
    if (updateThemeDto.facebookPixelId !== undefined) {
      theme.facebookPixelId = updateThemeDto.facebookPixelId;
    }
    if (updateThemeDto.mailchimpListId !== undefined) {
      theme.mailchimpListId = updateThemeDto.mailchimpListId;
    }

    theme.generatedHtml = null;
    theme.generatedCss = null;

    return await this.themeRepository.save(theme);
  }

  async verifyDomain(storeId: number): Promise<boolean> {
    const theme = await this.findOne(storeId);
    if (!theme || !theme.customDomain) {
      return false;
    }

    // TODO: Implementar verificación de dominio via DNS
    // Por ahora, marcamos como verificado si tiene dominio configurado
    theme.domainVerified = true;
    await this.themeRepository.save(theme);

    return true;
  }

  async delete(storeId: number): Promise<void> {
    const theme = await this.findOne(storeId);
    if (theme) {
      await this.themeRepository.remove(theme);
    }
  }

  /**
   * Renderiza la página web de la tienda usando la plantilla configurada.
   * Además, persiste el resultado para futuras consultas.
   */
  async renderStorePage(
    storeId: number,
    renderData: TemplateRenderData,
  ): Promise<TemplateRenderResult> {
    return this.renderAndPersistMarkup(storeId, renderData);
  }

  /**
   * Obtiene el HTML renderizado persistido. Si no existe, se regenera.
   * Cuando se proporcionan datos, se usa para regenerar el archivo.
   */
  async getRenderedHTML(
    storeId: number,
    renderData: TemplateRenderData = {},
  ): Promise<string> {
    const theme = await this.findOneOrCreate(storeId);
    const hasStoredMarkup = Boolean(theme.generatedHtml);
    const hasData = renderData && Object.keys(renderData).length > 0;

    if (!hasStoredMarkup || hasData) {
      const result = await this.renderAndPersistMarkup(storeId, renderData);
      return result.html;
    }

    return theme.generatedHtml as string;
  }

  async getStoredAssets(storeId: number): Promise<{ html: string | null; css: string | null }> {
    const theme = await this.findOneOrCreate(storeId);
    return {
      html: theme.generatedHtml,
      css: theme.generatedCss,
    };
  }
}

