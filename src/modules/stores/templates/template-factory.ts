import { StoreTemplate } from '../entities/store-theme.entity';
import { ITemplateStrategy } from './base-template';
import { ModernTemplate } from './modern-template';
import { MinimalistTemplate } from './minimalist-template';
import { ElegantTemplate } from './elegant-template';

/**
 * Factory Pattern: Crea instancias de plantillas según el tipo solicitado
 */
export class TemplateFactory {
  private static templates: Map<StoreTemplate, ITemplateStrategy> = new Map();
  
  /**
   * Obtiene una instancia de la plantilla solicitada
   * Usa Singleton para reutilizar instancias
   */
  static getTemplate(templateType: StoreTemplate): ITemplateStrategy {
    // Si ya existe una instancia, la reutiliza
    if (this.templates.has(templateType)) {
      return this.templates.get(templateType)!;
    }
    
    // Crea una nueva instancia según el tipo
    let template: ITemplateStrategy;
    
    switch (templateType) {
      case StoreTemplate.MODERN:
        template = new ModernTemplate();
        break;
      case StoreTemplate.MINIMALIST:
        template = new MinimalistTemplate();
        break;
      case StoreTemplate.ELEGANT:
        template = new ElegantTemplate();
        break;
      default:
        // Por defecto, usa la plantilla moderna
        template = new ModernTemplate();
    }
    
    // Guarda la instancia para reutilizarla
    this.templates.set(templateType, template);
    
    return template;
  }
  
  /**
   * Obtiene todas las plantillas disponibles
   */
  static getAllTemplates(): ITemplateStrategy[] {
    return [
      new ModernTemplate(),
      new MinimalistTemplate(),
      new ElegantTemplate(),
    ];
  }
  
  /**
   * Limpia el caché de plantillas (útil para testing)
   */
  static clearCache(): void {
    this.templates.clear();
  }
}

