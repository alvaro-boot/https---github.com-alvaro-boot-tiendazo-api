import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Product } from "../../products/entities/product.entity";
import { Store } from "../../stores/entities/store.entity";

@Entity("categories")
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  // Relations
  @Column()
  storeId: number;

  @ManyToOne(() => Store, (store) => store.categories)
  @JoinColumn({ name: "storeId" })
  store: Store;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
