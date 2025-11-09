import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import { TemplateRenderResult } from "./templates/base-template";
import { Store } from "./entities/store.entity";
import { StoreTheme } from "./entities/store-theme.entity";

@Injectable()
export class SiteGeneratorService {
  private readonly logger = new Logger(SiteGeneratorService.name);
  private readonly sitesRoot = path.resolve(process.cwd(), "sites");
  private readonly templatesRoot = path.resolve(
    __dirname,
    "templates",
    "base-files"
  );

  private async ensureSitesDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.sitesRoot, { recursive: true });
    } catch (error) {
      this.logger.error(
        "Could not create sites root directory",
        error as Error
      );
      throw new InternalServerErrorException(
        "Unable to prepare sites directory"
      );
    }
  }

  private resolveStoreFolder(storeId: number): string {
    return path.join(this.sitesRoot, storeId.toString());
  }

  private async loadBaseAsset(
    templateKey: string,
    asset: "app.js"
  ): Promise<string> {
    const assetPath = path.join(
      this.templatesRoot,
      templateKey.toLowerCase(),
      asset
    );
    return fs.readFile(assetPath, "utf-8");
  }

  private extractCssFromHtml(html: string): {
    strippedHtml: string;
    cssContent: string | null;
  } {
    const match = html.match(/<style>([\\s\\S]*?)<\/style>/i);
    if (!match) {
      return { strippedHtml: html, cssContent: null };
    }

    const css = match[1];
    const strippedHtml = html.replace(
      match[0],
      '<link rel="stylesheet" href="./styles.css">'
    );
    return { strippedHtml, cssContent: css };
  }

  async generateSiteFromRenderResult(params: {
    store: Store;
    theme: StoreTheme;
    renderResult: TemplateRenderResult;
  }): Promise<{ sitePath: string; indexPath: string }> {
    await this.ensureSitesDirectory();

    const { store, theme, renderResult } = params;
    const templateKey = theme.template.toLowerCase();

    const storeFolder = this.resolveStoreFolder(store.id);
    await fs.mkdir(storeFolder, { recursive: true });

    const indexPath = path.join(storeFolder, "index.html");
    const cssPath = path.join(storeFolder, "styles.css");
    const jsPath = path.join(storeFolder, "app.js");

    const { strippedHtml, cssContent } = this.extractCssFromHtml(
      renderResult.html
    );

    const metadataScript = `<script>window.__SITE_METADATA__ = ${JSON.stringify(
      {
        title: renderResult.metadata?.title ?? store.name,
        description: renderResult.metadata?.description ?? store.description,
        store: {
          name: store.name,
          description: store.description,
          logo: store.logo,
          address: store.address,
          phone: store.phone,
          email: store.email,
        },
        theme: {
          primaryColor: theme.primaryColor,
          secondaryColor: theme.secondaryColor,
          accentColor: theme.accentColor,
          backgroundColor: theme.backgroundColor,
          textColor: theme.textColor,
          showContact: theme.showContact,
        },
      }
    )};</script>`;

    const finalHtml = strippedHtml.replace(
      "</body>",
      `${metadataScript}\n<script src="./app.js"></script>\n</body>`
    );

    await Promise.all([
      fs.writeFile(indexPath, finalHtml, "utf-8"),
      fs.writeFile(cssPath, cssContent ?? renderResult.css ?? "", "utf-8"),
      fs.writeFile(
        jsPath,
        await this.loadBaseAsset(templateKey, "app.js"),
        "utf-8"
      ),
    ]);

    return { sitePath: storeFolder, indexPath };
  }
}
