import { Store } from '../entities/store.entity';
import { StoreTheme } from '../entities/store-theme.entity';
import { BaseTemplate, TemplateRenderData, TemplateRenderResult } from './base-template';

/**
 * Plantilla Moderna - Diseño limpio y contemporáneo
 * Strategy Pattern: Implementación concreta de la estrategia
 */
export class ModernTemplate extends BaseTemplate {
  getName(): string {
    return 'MODERN';
  }
  
  generateCSS(theme: StoreTheme): string {
    const primaryColor = this.getDefaultColor(theme.primaryColor, '#3B82F6');
    const secondaryColor = this.getDefaultColor(theme.secondaryColor, '#8B5CF6');
    const accentColor = this.getDefaultColor(theme.accentColor, '#10B981');
    const backgroundColor = this.getDefaultColor(theme.backgroundColor, '#FFFFFF');
    const textColor = this.getDefaultColor(theme.textColor, '#1F2937');
    const fontFamily = theme.fontFamily || 'Inter, sans-serif';
    
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
        line-height: 1.6;
      }
      
      .modern-header {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        padding: 1.5rem 0;
        color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        position: sticky;
        top: 0;
        z-index: 1000;
      }
      
      .modern-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .modern-logo .logo-text {
        font-size: 1.8rem;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      
      .modern-logo .logo-img {
        max-height: 50px;
        width: auto;
      }
      
      .modern-menu {
        display: flex;
        gap: 2rem;
      }
      
      .modern-menu a {
        color: white;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.3s;
      }
      
      .modern-menu a:hover {
        opacity: 0.8;
      }
      
      .modern-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
      }
      
      .modern-hero {
        text-align: center;
        padding: 6rem 0 5rem;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
        border-radius: 2rem;
        margin: 3rem 0;
      }
      
      .modern-hero h1 {
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.2;
      }
      
      .hero-subtitle {
        font-size: 1.3rem;
        color: var(--text-color);
        margin-bottom: 2rem;
        opacity: 0.8;
      }
      
      .modern-cta-btn {
        display: inline-block;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2.5rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      }
      
      .modern-cta-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      }
      
      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .section-header h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }
      
      .section-subtitle {
        font-size: 1.1rem;
        color: var(--text-color);
        opacity: 0.7;
      }
      
      .modern-products {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        margin: 3rem 0;
      }
      
      .modern-product-card {
        background: white;
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }
      
      .modern-product-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      }
      
      .product-image {
        width: 100%;
        height: 250px;
        overflow: hidden;
        background: #f5f5f5;
      }
      
      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }
      
      .modern-product-card:hover .product-image img {
        transform: scale(1.1);
      }
      
      .product-placeholder {
        width: 100%;
        height: 250px;
        background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 0.9rem;
      }
      
      .product-info {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .product-info h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }
      
      .product-description {
        color: #666;
        font-size: 0.95rem;
        margin-bottom: 1rem;
        flex: 1;
      }
      
      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
      }
      
      .product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
      }
      
      .modern-btn {
        background: var(--primary-color);
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
      }
      
      .modern-btn:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
      }
      
      .featured-card {
        border: 2px solid var(--accent-color);
      }
      
      .contact-section {
        margin: 5rem 0;
        padding: 3rem 0;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
        border-radius: 2rem;
      }
      
      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .contact-item {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      
      .contact-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      
      .contact-item h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
      }
      
      .contact-item p {
        color: var(--text-color);
      }
      
      .contact-item a {
        color: var(--primary-color);
        text-decoration: none;
      }
      
      .contact-item a:hover {
        text-decoration: underline;
      }
      
      .empty-state {
        text-align: center;
        padding: 4rem 0;
        color: var(--text-color);
        opacity: 0.6;
      }
      
      .modern-footer {
        background: var(--text-color);
        color: white;
        padding: 2rem 0;
        margin-top: 4rem;
        text-align: center;
      }
      
      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
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
        <meta name="description" content="${description || 'Compra en línea los mejores productos'}">
        <style>${this.generateCSS(theme)}</style>
      </head>
      <body>
        <header class="modern-header">
          <div class="modern-container">
            <div class="modern-nav">
              <div class="modern-logo">${store.logo ? `<img src="${store.logo}" alt="${store.name}" class="logo-img">` : `<span class="logo-text">${store.name}</span>`}</div>
              <nav class="modern-menu">
                <a href="#productos">Productos</a>
                ${theme.showContact ? '<a href="#contacto">Contacto</a>' : ''}
              </nav>
            </div>
          </div>
        </header>
        
        <main class="modern-container">
          <section class="modern-hero">
            <h1>${store.name}</h1>
            <p class="hero-subtitle">${description || 'Descubre nuestra colección exclusiva'}</p>
            <a href="#productos" class="modern-cta-btn">Explorar Productos</a>
          </section>
          
          ${theme.showFeatured && data.featuredProducts && data.featuredProducts.length > 0 ? `
            <section class="featured-section" id="destacados">
              <div class="section-header">
                <h2>Productos Destacados</h2>
                <p class="section-subtitle">Los más populares de nuestra colección</p>
              </div>
              <div class="modern-products">
                ${data.featuredProducts.map(product => `
                  <div class="modern-product-card featured-card">
                    ${product.image ? `<div class="product-image"><img src="${product.image}" alt="${product.name}"></div>` : ''}
                    <div class="product-info">
                      <h3>${product.name}</h3>
                      <p class="product-price">${this.formatPrice(product.sellPrice)}</p>
                      <button class="modern-btn">Comprar Ahora</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          
          ${products.length > 0 ? `
            <section class="products-section" id="productos">
              <div class="section-header">
                <h2>Nuestros Productos</h2>
                <p class="section-subtitle">Explora nuestra selección completa</p>
              </div>
              <div class="modern-products">
                ${products.map(product => `
                  <div class="modern-product-card">
                    ${product.image ? `<div class="product-image"><img src="${product.image}" alt="${product.name}"></div>` : '<div class="product-placeholder">Sin imagen</div>'}
                    <div class="product-info">
                      <h3>${product.name}</h3>
                      ${product.description ? `<p class="product-description">${this.sanitizeDescription(product.description, 80)}</p>` : ''}
                      <div class="product-footer">
                        <p class="product-price">${this.formatPrice(product.sellPrice)}</p>
                        <button class="modern-btn">Agregar al Carrito</button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : '<div class="empty-state"><p>Próximamente tendremos productos disponibles.</p></div>'}
          
          ${theme.showContact ? `
            <section class="contact-section" id="contacto">
              <div class="section-header">
                <h2>Contáctanos</h2>
                <p class="section-subtitle">Estamos aquí para ayudarte</p>
              </div>
              <div class="contact-grid">
                ${store.address ? `
                  <div class="contact-item">
                    <div class="contact-icon">📍</div>
                    <h3>Dirección</h3>
                    <p>${store.address}</p>
                  </div>
                ` : ''}
                ${store.phone ? `
                  <div class="contact-item">
                    <div class="contact-icon">📞</div>
                    <h3>Teléfono</h3>
                    <p><a href="tel:${store.phone}">${store.phone}</a></p>
                  </div>
                ` : ''}
                ${store.email ? `
                  <div class="contact-item">
                    <div class="contact-icon">✉️</div>
                    <h3>Email</h3>
                    <p><a href="mailto:${store.email}">${store.email}</a></p>
                  </div>
                ` : ''}
              </div>
            </section>
          ` : ''}
        </main>
        
        <footer class="modern-footer">
          <div class="footer-content">
            <p>&copy; ${new Date().getFullYear()} ${store.name}. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
      </html>
    `;
    
    return {
      html,
      css: this.generateCSS(theme),
      metadata: {
        title: store.name,
        description: description || `${store.name} - Compra en línea los mejores productos`,
        keywords: ['compra online', 'productos', 'tienda', store.name],
      },
    };
  }
}

