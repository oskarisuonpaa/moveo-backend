import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'user_profiles' })
export default class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  app_email!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  shop_email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  first_name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_code!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  study_location!: string | null;

  @Column({ type: 'date', nullable: true })
  membership_start!: Date | null;

  @Column({ type: 'date', nullable: true })
  membership_end!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_name!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verification_token!: string | null;

  @Column({ type: 'boolean', default: false })
  is_verified!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  role!: string | null;
}
