import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../shared/base.entity';
import { Store } from '../../stores/entities/store.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  avatar: string;

  // Relations
  @Column({ nullable: true })
  storeId: number;

  @ManyToOne(() => Store, (store) => store.users)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];
}
