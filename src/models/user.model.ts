import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  accessToken!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'bigint', nullable: true })
  expiryDate!: number | null;
}
