import { Store } from "../entities/store.entity";
import { StoreTheme } from "../entities/store-theme.entity";

/**
 * Interfaz base para todas las plantillas de tienda
 * Strategy Pattern: Define el contrato común para todas las estrategias
 */
export interface ITemplateStrategy {
  /**
   * Renderiza el HTML de la página de la tienda usando la información y tema
   */
  render(
    store: Store,
    theme: StoreTheme,
    data: TemplateRenderData
  ): TemplateRenderResult;

  /**
   * Genera el CSS personalizado basado en el tema
   */
  generateCSS(theme: StoreTheme): string;

  /**
   * Obtiene el nombre de la plantilla
   */
  getName(): string;
}

/**
 * Datos necesarios para renderizar la plantilla
 */
export interface TemplateRenderData {
  products?: any[];
  categories?: any[];
  featuredProducts?: any[];
  storeInfo?: any;
}

/**
 * Resultado del renderizado de la plantilla
 */
export interface TemplateRenderResult {
  html: string;
  css: string;
  metadata: {
    title: string;
    description: string;
    keywords?: string[];
  };
}

/**
 * Clase base abstracta para las plantillas
 * Proporciona funcionalidad común
 */
export abstract class BaseTemplate implements ITemplateStrategy {
  abstract getName(): string;

  abstract render(
    store: Store,
    theme: StoreTheme,
    data: TemplateRenderData
  ): TemplateRenderResult;

  abstract generateCSS(theme: StoreTheme): string;

  /**
   * Métodos auxiliares comunes
   */
  protected formatPrice(price: number, currency: string = "COP"): string {
    const formatted = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
    return formatted;
  }

  protected sanitizeDescription(
    description: string,
    maxLength: number = 150
  ): string {
    if (!description || description.length < 10) {
      return "";
    }

    // Eliminar caracteres especiales problemáticos
    let cleaned = description.replace(/<[^>]*>/g, "").trim();

    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength) + "...";
    }

    return cleaned;
  }

  protected getDefaultColor(
    color: string | undefined,
    defaultValue: string
  ): string {
    return color || defaultValue;
  }
}
