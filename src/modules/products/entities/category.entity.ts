import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Product } from './product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
