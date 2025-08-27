import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'user_settings' })
export default class UserSettings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  user_id!: string;
}
