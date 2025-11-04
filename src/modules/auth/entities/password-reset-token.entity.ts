import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../shared/base.entity';
import { User } from './user.entity';

@Entity('password_reset_tokens')
@Index(['token'], { unique: true })
@Index(['userId', 'expiresAt'])
export class PasswordResetToken extends BaseEntity {
  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  ipAddress: string;

  @Column({ nullable: true, type: 'text' })
  userAgent: string;
}

