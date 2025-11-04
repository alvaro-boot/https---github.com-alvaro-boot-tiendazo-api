import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Category } from "../../categories/entities/category.entity";
import { Store } from "../../stores/entities/store.entity";
import { SaleDetail } from "../../sales/entities/sale-detail.entity";
import { InventoryMovement } from "../../inventory/entities/inventory-movement.entity";

@Entity("products")
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  purchasePrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  sellPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  minStock: number;

  @Column({ nullable: true })
  barcode: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[]; // Múltiples imágenes para marketplace

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPublic: boolean; // Visible en marketplace (solo para tiendas PUBLIC)

  @Column({ nullable: true })
  slug: string; // Slug único para URL del producto

  @Column({ default: 0 })
  views: number; // Contador de vistas en marketplace

  @Column({ default: 0 })
  salesCount: number; // Contador de ventas online

  @Column({ nullable: true, type: 'text' })
  metaDescription: string; // Para SEO

  @Column({ nullable: true })
  metaKeywords: string; // Para SEO

  @Column({ default: true })
  allowShipping: boolean; // Si permite envío

  @Column({ default: false })
  isDigital: boolean; // Si es producto digital (no requiere envío)

  // Relations
  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column()
  storeId: number;

  @ManyToOne(() => Store, (store) => store.products)
  @JoinColumn({ name: "storeId" })
  store: Store;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.product)
  saleDetails: SaleDetail[];

  @OneToMany(() => InventoryMovement, (movement) => movement.product)
  inventoryMovements: InventoryMovement[];
}
