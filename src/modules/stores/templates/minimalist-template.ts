import { Store } from '../entities/store.entity';
import { StoreTheme } from '../entities/store-theme.entity';
import { BaseTemplate, TemplateRenderData, TemplateRenderResult } from './base-template';

/**
 * Plantilla Minimalista - Diseño simple y elegante
 * Strategy Pattern: Implementación concreta de la estrategia
 */
export class MinimalistTemplate extends BaseTemplate {
  getName(): string {
    return 'MINIMALIST';
  }
  
  generateCSS(theme: StoreTheme): string {
    const primaryColor = this.getDefaultColor(theme.primaryColor, '#000000');
    const secondaryColor = this.getDefaultColor(theme.secondaryColor, '#666666');
    const backgroundColor = this.getDefaultColor(theme.backgroundColor, '#FFFFFF');
    const textColor = this.getDefaultColor(theme.textColor, '#000000');
    const fontFamily = theme.fontFamily || 'Helvetica, Arial, sans-serif';
    
    return `
      :root {
        --primary-color: ${primaryColor};
        --secondary-color: ${secondaryColor};
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
        line-height: 1.8;
        font-size: 16px;
      }
      
      .minimalist-header {
        border-bottom: 1px solid #e5e5e5;
        padding: 3rem 0 2rem;
      }
      
      .minimalist-brand {
        text-align: center;
      }
      
      .brand-name {
        font-size: 1.5rem;
        font-weight: 300;
        letter-spacing: 4px;
        color: var(--primary-color);
        text-transform: uppercase;
      }
      
      .brand-logo {
        max-height: 40px;
        width: auto;
      }
      
      .minimalist-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 2rem;
      }
      
      .minimalist-hero {
        text-align: center;
        padding: 8rem 0 6rem;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .minimalist-hero h1 {
        font-size: 3rem;
        font-weight: 200;
        letter-spacing: 3px;
        margin-bottom: 2rem;
        color: var(--primary-color);
        text-transform: uppercase;
      }
      
      .hero-text {
        font-size: 1.1rem;
        font-weight: 300;
        color: var(--secondary-color);
        line-height: 1.8;
        max-width: 600px;
        margin: 0 auto;
      }
      
      .minimalist-products {
        display: grid;
        grid-template-columns: 1fr;
        gap: 4rem;
        margin: 6rem 0;
      }
      
      .minimalist-product-card {
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 3rem;
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 3rem;
        align-items: center;
      }
      
      .product-image-wrapper {
        width: 100%;
        height: 300px;
        overflow: hidden;
        background: #fafafa;
      }
      
      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.3s;
      }
      
      .minimalist-product-card:hover .product-image {
        opacity: 0.8;
      }
      
      .product-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .product-title {
        font-size: 1.8rem;
        font-weight: 300;
        letter-spacing: 1px;
        color: var(--primary-color);
        margin: 0;
      }
      
      .product-text {
        font-size: 1rem;
        font-weight: 300;
        color: var(--secondary-color);
        line-height: 1.8;
        margin: 0;
      }
      
      .product-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
      }
      
      .product-price {
        font-size: 1.5rem;
        font-weight: 300;
        color: var(--primary-color);
        letter-spacing: 1px;
      }
      
      .minimalist-btn {
        background: transparent;
        color: var(--primary-color);
        padding: 0.6rem 2rem;
        border: 1px solid var(--primary-color);
        font-weight: 300;
        font-size: 0.9rem;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
      }
      
      .minimalist-btn:hover {
        background: var(--primary-color);
        color: white;
      }
      
      .empty-message {
        text-align: center;
        padding: 6rem 0;
        color: var(--secondary-color);
        font-weight: 300;
        font-size: 1.1rem;
      }
      
      .contact-section {
        margin: 6rem 0;
        padding-top: 4rem;
        border-top: 1px solid #e5e5e5;
      }
      
      .section-title {
        font-size: 1.5rem;
        font-weight: 300;
        letter-spacing: 2px;
        text-align: center;
        margin-bottom: 3rem;
        color: var(--primary-color);
        text-transform: uppercase;
      }
      
      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 1.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .info-label {
        font-weight: 300;
        color: var(--secondary-color);
        letter-spacing: 1px;
        font-size: 0.9rem;
        text-transform: uppercase;
      }
      
      .info-value {
        color: var(--primary-color);
        font-weight: 300;
      }
      
      .info-value a {
        color: var(--primary-color);
        text-decoration: none;
      }
      
      .info-value a:hover {
        text-decoration: underline;
      }
      
      .minimalist-footer {
        border-top: 1px solid #e5e5e5;
        padding: 3rem 0;
        margin-top: 8rem;
        text-align: center;
        color: var(--secondary-color);
        font-size: 0.85rem;
        font-weight: 300;
        letter-spacing: 1px;
      }
      
      @media (max-width: 768px) {
        .minimalist-product-card {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .product-image-wrapper {
          height: 250px;
        }
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
        <meta name="description" content="${description || 'Productos seleccionados con cuidado'}">
        <style>${this.generateCSS(theme)}</style>
      </head>
      <body>
        <header class="minimalist-header">
          <div class="minimalist-container">
            <div class="minimalist-brand">
              ${store.logo ? `<img src="${store.logo}" alt="${store.name}" class="brand-logo">` : `<span class="brand-name">${store.name}</span>`}
            </div>
          </div>
        </header>
        
        <main class="minimalist-container">
          <section class="minimalist-hero">
            <h1>${store.name}</h1>
            ${description ? `<p class="hero-text">${description}</p>` : ''}
          </section>
          
          ${products.length > 0 ? `
            <section class="products-section">
              <div class="minimalist-products">
                ${products.map(product => `
                  <article class="minimalist-product-card">
                    ${product.image ? `<div class="product-image-wrapper"><img src="${product.image}" alt="${product.name}" class="product-image"></div>` : ''}
                    <div class="product-content">
                      <h2 class="product-title">${product.name}</h2>
                      ${product.description ? `<p class="product-text">${this.sanitizeDescription(product.description, 100)}</p>` : ''}
                      <div class="product-meta">
                        <span class="product-price">${this.formatPrice(product.sellPrice)}</span>
                        <button class="minimalist-btn">Ver más</button>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
            </section>
          ` : '<div class="empty-message"><p>Colección disponible próximamente</p></div>'}
          
          ${theme.showContact ? `
            <section class="contact-section">
              <h2 class="section-title">Contacto</h2>
              <div class="contact-info">
                ${store.address ? `<div class="info-item"><span class="info-label">Dirección</span><span class="info-value">${store.address}</span></div>` : ''}
                ${store.phone ? `<div class="info-item"><span class="info-label">Teléfono</span><span class="info-value"><a href="tel:${store.phone}">${store.phone}</a></span></div>` : ''}
                ${store.email ? `<div class="info-item"><span class="info-label">Email</span><span class="info-value"><a href="mailto:${store.email}">${store.email}</a></span></div>` : ''}
              </div>
            </section>
          ` : ''}
        </main>
        
        <footer class="minimalist-footer">
          <p>&copy; ${new Date().getFullYear()} ${store.name}</p>
        </footer>
      </body>
      </html>
    `;
    
    return {
      html,
      css: this.generateCSS(theme),
      metadata: {
        title: store.name,
        description: description || `${store.name} - Productos seleccionados`,
        keywords: ['compra', 'productos', 'selección', store.name],
      },
    };
  }
}

