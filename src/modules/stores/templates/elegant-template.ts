import { Store } from '../entities/store.entity';
import { StoreTheme } from '../entities/store-theme.entity';
import { BaseTemplate, TemplateRenderData, TemplateRenderResult } from './base-template';

/**
 * Plantilla Elegante - Diseño sofisticado y refinado
 * Strategy Pattern: Implementación concreta de la estrategia
 */
export class ElegantTemplate extends BaseTemplate {
  getName(): string {
    return 'ELEGANT';
  }
  
  generateCSS(theme: StoreTheme): string {
    const primaryColor = this.getDefaultColor(theme.primaryColor, '#1a1a1a');
    const secondaryColor = this.getDefaultColor(theme.secondaryColor, '#8B7355');
    const accentColor = this.getDefaultColor(theme.accentColor, '#D4AF37');
    const backgroundColor = this.getDefaultColor(theme.backgroundColor, '#FAFAFA');
    const textColor = this.getDefaultColor(theme.textColor, '#2C2C2C');
    const fontFamily = theme.fontFamily || 'Georgia, serif';
    
    return `
      :root {
        --primary-color: ${primaryColor};
        --secondary-color: ${secondaryColor};
        --accent-color: ${accentColor};
        --bg-color: ${backgroundColor};
        --text-color: ${textColor};
        --font-family: ${fontFamily};
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: var(--font-family);
        background-color: var(--bg-color);
        color: var(--text-color);
        line-height: 1.7;
      }
      
      .elegant-header {
        background: var(--primary-color);
        color: white;
        padding: 4rem 0 3rem;
        text-align: center;
        border-bottom: 4px solid var(--accent-color);
        position: relative;
      }
      
      .elegant-header::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 4px;
        background: var(--accent-color);
      }
      
      .elegant-brand {
        margin-bottom: 1.5rem;
      }
      
      .brand-name {
        font-size: 2.5rem;
        font-weight: 400;
        letter-spacing: 4px;
        text-transform: uppercase;
        font-family: 'Georgia', serif;
      }
      
      .brand-logo {
        max-height: 60px;
        width: auto;
      }
      
      .header-description {
        font-size: 1.1rem;
        font-style: italic;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
      }
      
      .elegant-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
      }
      
      .elegant-hero {
        text-align: center;
        padding: 6rem 0 5rem;
        background: linear-gradient(to bottom, rgba(26, 26, 26, 0.03), transparent);
        position: relative;
      }
      
      .elegant-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 1px;
        height: 60px;
        background: var(--accent-color);
      }
      
      .elegant-hero h1 {
        font-size: 4rem;
        font-weight: 300;
        margin-bottom: 2rem;
        color: var(--primary-color);
        letter-spacing: 3px;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
      }
      
      .elegant-hero::after {
        content: '';
        display: block;
        width: 150px;
        height: 2px;
        background: var(--accent-color);
        margin: 2rem auto 0;
      }
      
      .hero-description {
        font-size: 1.2rem;
        color: var(--secondary-color);
        max-width: 700px;
        margin: 2rem auto 0;
        line-height: 1.8;
        font-style: italic;
      }
      
      .section-title-wrapper {
        text-align: center;
        margin-bottom: 4rem;
        position: relative;
      }
      
      .section-title {
        font-size: 2.5rem;
        font-weight: 300;
        color: var(--primary-color);
        letter-spacing: 2px;
        font-family: 'Georgia', serif;
        text-transform: uppercase;
        margin-bottom: 1rem;
      }
      
      .section-title-wrapper::after {
        content: '';
        display: block;
        width: 120px;
        height: 2px;
        background: var(--accent-color);
        margin: 1.5rem auto;
      }
      
      .elegant-products {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 3rem;
        margin: 4rem 0;
      }
      
      .elegant-product-card {
        background: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        border-top: 4px solid var(--accent-color);
        transition: all 0.4s ease;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .elegant-product-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      }
      
      .elegant-product-card.featured {
        border-top-width: 6px;
      }
      
      .product-image-container {
        width: 100%;
        height: 350px;
        overflow: hidden;
        background: #fafafa;
        position: relative;
      }
      
      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .elegant-product-card:hover .product-image {
        transform: scale(1.05);
      }
      
      .product-image-placeholder {
        width: 100%;
        height: 350px;
        background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 0.9rem;
        font-style: italic;
      }
      
      .product-details {
        padding: 2.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .product-name {
        font-size: 1.6rem;
        font-weight: 400;
        margin-bottom: 1rem;
        color: var(--primary-color);
        font-family: 'Georgia', serif;
        letter-spacing: 0.5px;
      }
      
      .product-description {
        color: var(--secondary-color);
        margin-bottom: 1.5rem;
        line-height: 1.7;
        font-size: 1rem;
        flex: 1;
      }
      
      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #f0f0f0;
      }
      
      .product-price {
        font-size: 1.8rem;
        font-weight: 400;
        color: var(--accent-color);
        letter-spacing: 1px;
        font-family: 'Georgia', serif;
      }
      
      .elegant-btn {
        background: var(--primary-color);
        color: white;
        padding: 1rem 2.5rem;
        border: none;
        font-weight: 500;
        letter-spacing: 2px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        font-size: 0.85rem;
      }
      
      .elegant-btn:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }
      
      .empty-state {
        text-align: center;
        padding: 5rem 0;
        color: var(--secondary-color);
        font-size: 1.1rem;
        font-style: italic;
      }
      
      .contact-section {
        margin: 6rem 0;
        padding-top: 4rem;
        border-top: 3px solid var(--accent-color);
      }
      
      .contact-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 3rem;
        max-width: 1000px;
        margin: 3rem auto 0;
      }
      
      .contact-block {
        display: flex;
        gap: 1.5rem;
        padding: 2rem;
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        border-left: 3px solid var(--accent-color);
      }
      
      .contact-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      
      .contact-content h3 {
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
        font-family: 'Georgia', serif;
        letter-spacing: 0.5px;
      }
      
      .contact-content p {
        color: var(--secondary-color);
        line-height: 1.6;
      }
      
      .contact-content a {
        color: var(--primary-color);
        text-decoration: none;
        transition: color 0.3s;
      }
      
      .contact-content a:hover {
        color: var(--accent-color);
      }
      
      .elegant-footer {
        background: var(--primary-color);
        color: white;
        padding: 4rem 0;
        margin-top: 6rem;
        text-align: center;
        position: relative;
      }
      
      .elegant-footer::before {
        content: '';
        display: block;
        width: 150px;
        height: 3px;
        background: var(--accent-color);
        margin: 0 auto 2rem;
      }
      
      .elegant-footer p {
        font-size: 0.95rem;
        letter-spacing: 1px;
        opacity: 0.9;
      }
    `;
  }
  
  render(store: Store, theme: StoreTheme, data: TemplateRenderData): TemplateRenderResult {
    const description = this.sanitizeDescription(store.description);
    const products = data.products || [];
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${store.name}</title>
        <meta name="description" content="${description || 'Colección exclusiva de productos premium'}">
        <style>${this.generateCSS(theme)}</style>
      </head>
      <body>
        <header class="elegant-header">
          <div class="elegant-container">
            <div class="elegant-brand">
              ${store.logo ? `<img src="${store.logo}" alt="${store.name}" class="brand-logo">` : `<span class="brand-name">${store.name}</span>`}
            </div>
            ${description ? `<p class="header-description">${description}</p>` : ''}
          </div>
        </header>
        
        <main class="elegant-container">
          <section class="elegant-hero">
            <h1>Bienvenido</h1>
            <p class="hero-description">Descubra nuestra exclusiva colección de productos cuidadosamente seleccionados</p>
          </section>
          
          ${theme.showFeatured && data.featuredProducts && data.featuredProducts.length > 0 ? `
            <section class="featured-section">
              <div class="section-title-wrapper">
                <h2 class="section-title">Colección Destacada</h2>
              </div>
              <div class="elegant-products">
                ${data.featuredProducts.map(product => `
                  <div class="elegant-product-card featured">
                    ${product.image ? `<div class="product-image-container"><img src="${product.image}" alt="${product.name}" class="product-image"></div>` : ''}
                    <div class="product-details">
                      <h3 class="product-name">${product.name}</h3>
                      <p class="product-price">${this.formatPrice(product.sellPrice)}</p>
                      <button class="elegant-btn">Descubrir</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          
          ${products.length > 0 ? `
            <section class="products-section">
              <div class="section-title-wrapper">
                <h2 class="section-title">Nuestra Colección</h2>
              </div>
              <div class="elegant-products">
                ${products.map(product => `
                  <div class="elegant-product-card">
                    ${product.image ? `<div class="product-image-container"><img src="${product.image}" alt="${product.name}" class="product-image"></div>` : '<div class="product-image-placeholder"></div>'}
                    <div class="product-details">
                      <h3 class="product-name">${product.name}</h3>
                      ${product.description ? `<p class="product-description">${this.sanitizeDescription(product.description, 100)}</p>` : ''}
                      <div class="product-footer">
                        <p class="product-price">${this.formatPrice(product.sellPrice)}</p>
                        <button class="elegant-btn">Agregar</button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : '<div class="empty-state"><p>Próximamente estará disponible nuestra colección exclusiva.</p></div>'}
          
          ${theme.showContact ? `
            <section class="contact-section">
              <div class="section-title-wrapper">
                <h2 class="section-title">Contáctenos</h2>
              </div>
              <div class="contact-details">
                ${store.address ? `
                  <div class="contact-block">
                    <div class="contact-icon">📍</div>
                    <div class="contact-content">
                      <h3>Dirección</h3>
                      <p>${store.address}</p>
                    </div>
                  </div>
                ` : ''}
                ${store.phone ? `
                  <div class="contact-block">
                    <div class="contact-icon">📞</div>
                    <div class="contact-content">
                      <h3>Teléfono</h3>
                      <p><a href="tel:${store.phone}">${store.phone}</a></p>
                    </div>
                  </div>
                ` : ''}
                ${store.email ? `
                  <div class="contact-block">
                    <div class="contact-icon">✉️</div>
                    <div class="contact-content">
                      <h3>Email</h3>
                      <p><a href="mailto:${store.email}">${store.email}</a></p>
                    </div>
                  </div>
                ` : ''}
              </div>
            </section>
          ` : ''}
        </main>
        
        <footer class="elegant-footer">
          <p>&copy; ${new Date().getFullYear()} ${store.name}. Todos los derechos reservados.</p>
        </footer>
      </body>
      </html>
    `;
    
    return {
      html,
      css: this.generateCSS(theme),
      metadata: {
        title: store.name,
        description: description || `${store.name} - Colección exclusiva de productos premium`,
        keywords: ['productos premium', 'colección exclusiva', 'alta calidad', store.name],
      },
    };
  }
}

