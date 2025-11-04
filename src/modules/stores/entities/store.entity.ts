import { Entity, Column, OneToMany, Index } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { User } from "../../auth/entities/user.entity";
import { Product } from "../../products/entities/product.entity";
import { Sale } from "../../sales/entities/sale.entity";
import { Category } from "../../categories/entities/category.entity";
import { Client } from "../../clients/entities/client.entity";

export enum StoreType {
  INTERNAL = "INTERNAL", // POS - Solo ventas internas
  PUBLIC = "PUBLIC", // Marketplace - Venta online pública
}

@Entity("stores")
@Index(["slug"], { unique: true })
@Index(["type", "isActive"])
export class Store extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, type: "text" })
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ 
    type: "enum", 
    enum: StoreType, 
    default: StoreType.INTERNAL 
  })
  type: StoreType;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isPublic: boolean; // Para marketplace - si está visible públicamente

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ default: "COP" })
  currency: string;

  // Configuración de facturación electrónica
  @Column({ default: false })
  electronicInvoiceEnabled: boolean;

  @Column({ nullable: true })
  electronicInvoiceProvider: string; // Alegra, Siigo, Facturatech, etc.

  @Column({ nullable: true, type: "text" })
  electronicInvoiceConfig: string; // JSON con configuración del proveedor

  // Configuración de pagos
  @Column({ nullable: true })
  paymentGateway: string; // Wompi, ePayco, MercadoPago

  @Column({ nullable: true, type: "text" })
  paymentGatewayConfig: string; // JSON con keys y configuración

  // Configuración de envíos
  @Column({ default: false })
  shippingEnabled: boolean;

  @Column({ nullable: true })
  shippingProvider: string; // Servientrega, Envia, Coordinadora

  @Column({ nullable: true, type: "text" })
  shippingConfig: string; // JSON con configuración de envíos

  // Ubicación para Google Maps
  @Column({ nullable: true, type: "decimal", precision: 10, scale: 8 })
  latitude: number;

  @Column({ nullable: true, type: "decimal", precision: 11, scale: 8 })
  longitude: number;

  // SEO
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true, type: "text" })
  metaDescription: string;

  @Column({ nullable: true })
  metaKeywords: string;

  // Relations
  @OneToMany(() => User, (user) => user.store)
  users: User[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Sale, (sale) => sale.store)
  sales: Sale[];

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];

  @OneToMany(() => Client, (client) => client.store)
  clients: Client[];
}
