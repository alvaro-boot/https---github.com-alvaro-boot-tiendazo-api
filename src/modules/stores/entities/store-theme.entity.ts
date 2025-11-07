import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Store } from "./store.entity";

export enum StoreTemplate {
  MODERN = "MODERN", // Plantilla moderna
  MINIMALIST = "MINIMALIST", // Plantilla minimalista
  ELEGANT = "ELEGANT", // Plantilla elegante
}

@Entity("store_themes")
export class StoreTheme extends BaseEntity {
  @Column()
  storeId: number;

  // Plantilla base
  @Column({
    type: "enum",
    enum: StoreTemplate,
    default: StoreTemplate.MODERN,
  })
  template: StoreTemplate;

  // Colores
  @Column({ nullable: true })
  primaryColor: string; // Color principal (hex)

  @Column({ nullable: true })
  secondaryColor: string; // Color secundario (hex)

  @Column({ nullable: true })
  accentColor: string; // Color de acento (hex)

  @Column({ nullable: true })
  backgroundColor: string; // Color de fondo (hex)

  @Column({ nullable: true })
  textColor: string; // Color de texto (hex)

  // Tipografía
  @Column({ nullable: true })
  fontFamily: string; // Familia de fuente (ej: "Inter", "Roboto", "Poppins")

  @Column({ nullable: true })
  headingFont: string; // Fuente para títulos

  @Column({ nullable: true })
  bodyFont: string; // Fuente para cuerpo

  // Imágenes personalizadas
  @Column({ nullable: true })
  favicon: string; // URL del favicon

  @Column({ nullable: true })
  customBanner: string; // URL del banner personalizado

  // Secciones activas/desactivadas
  @Column({ default: true })
  showReviews: boolean; // Mostrar reseñas

  @Column({ default: true })
  showFeatured: boolean; // Mostrar productos destacados

  @Column({ default: true })
  showCategories: boolean; // Mostrar categorías

  @Column({ default: true })
  showContact: boolean; // Mostrar sección de contacto

  @Column({ default: false })
  showBlog: boolean; // Mostrar blog/noticias

  // Configuración de layout
  @Column({ nullable: true, type: "text" })
  layoutConfig: string; // JSON con configuración de layout personalizado

  // Dominio personalizado
  @Column({ nullable: true })
  customDomain: string; // Dominio propio (ej: mitienda.com)

  @Column({ nullable: true })
  subdomain: string; // Subdominio (ej: mitienda.tiendazo.co)

  @Column({ default: false })
  domainVerified: boolean; // Si el dominio está verificado

  @Column({ nullable: true, type: "text" })
  domainConfig: string; // JSON con configuración de DNS (CNAME, etc.)

  // Configuración de marketing
  @Column({ nullable: true })
  googleAnalyticsId: string; // ID de Google Analytics

  @Column({ nullable: true })
  facebookPixelId: string; // ID de Facebook Pixel

  @Column({ nullable: true })
  mailchimpListId: string; // ID de lista de Mailchimp

  // Relación con Store
  @ManyToOne(() => Store, (store) => store.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "storeId" })
  store: Store;
}

