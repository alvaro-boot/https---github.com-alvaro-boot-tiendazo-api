import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { promises as fs } from "fs";
import * as path from "path";
import { StoreTheme, StoreTemplate } from "./entities/store-theme.entity";
import { Store } from "./entities/store.entity";
import { CreateStoreThemeDto } from "./dto/create-store-theme.dto";
import { UpdateStoreThemeDto } from "./dto/update-store-theme.dto";
import { TemplateRenderData, TemplateRenderResult } from "./templates/base-template";
import { SiteGeneratorService } from "./site-generator.service";
import { TemplateFactory } from "./templates/template-factory";

@Injectable()
export class StoreThemesService {
  constructor(
    @InjectRepository(StoreTheme)
    private themeRepository: Repository<StoreTheme>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private siteGenerator: SiteGeneratorService,
  ) {}

  private readonly logger = new Logger(StoreThemesService.name);

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
    const renderResult = template.render(store, theme, renderData);

    const siteInfo = await this.siteGenerator.generateSiteFromRenderResult({
      store,
      theme,
      renderResult,
    });

    theme.generatedHtml = null;
    theme.generatedCss = null;
    theme.sitePath = siteInfo.sitePath;
    theme.indexPath = siteInfo.indexPath;
    await this.themeRepository.save(theme);

    return renderResult;
  }

  async create(storeId: number, createThemeDto: CreateStoreThemeDto): Promise<StoreTheme> {
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const existingTheme = await this.themeRepository.findOne({
      where: { storeId },
    });

    if (existingTheme) {
      throw new Error("Theme already exists for this store. Use update instead.");
    }

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
    await this.renderAndPersistMarkup(storeId, {});

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
      const created = await this.create(storeId, updateThemeDto as CreateStoreThemeDto);
      await this.renderAndPersistMarkup(storeId, {});
      return created;
    }

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
      theme.domainVerified = false;
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

    theme.sitePath = null;
    theme.indexPath = null;

    const savedTheme = await this.themeRepository.save(theme);
    await this.renderAndPersistMarkup(storeId, {});

    return savedTheme;
  }

  async verifyDomain(storeId: number): Promise<boolean> {
    const theme = await this.findOne(storeId);
    if (!theme || !theme.customDomain) {
      return false;
    }

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

  async renderStorePage(
    storeId: number,
    renderData: TemplateRenderData,
  ): Promise<TemplateRenderResult> {
    const result = await this.renderAndPersistMarkup(storeId, renderData);
    return result;
  }

  async getRenderedHTML(
    storeId: number,
    renderData: TemplateRenderData = {},
  ): Promise<string> {
    const theme = await this.findOneOrCreate(storeId);
    const hasSite = Boolean(theme.indexPath);
    const hasData = renderData && Object.keys(renderData).length > 0;

    if (!hasSite || hasData) {
      const result = await this.renderAndPersistMarkup(storeId, renderData);
      return result.html;
    }

    try {
      return await fs.readFile(theme.indexPath as string, "utf-8");
    } catch (error) {
      this.logger.error("Unable to read generated site", error as Error);
      const result = await this.renderAndPersistMarkup(storeId, renderData);
      return result.html;
    }
  }

  async getStoredAssets(storeId: number): Promise<{ html: string | null; css: string | null }> {
    const theme = await this.findOneOrCreate(storeId);
    return {
      html: theme.indexPath,
      css: theme.sitePath ? path.join(theme.sitePath, "styles.css") : null,
    };
  }
}

