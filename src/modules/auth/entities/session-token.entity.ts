import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { User } from "./user.entity";

@Entity("session_tokens")
@Index(["userId"])
@Index(["expiresAt"])
export class SessionToken extends BaseEntity {
  @Column({ type: "varchar", length: 500, unique: true })
  token: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  deviceName: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  deviceType: string; // 'web', 'mobile', 'desktop', etc.
}
