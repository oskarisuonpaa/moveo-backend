import 'reflect-metadata';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import UserProfile from './userProfile.model';

@Entity({ name: 'pending_shop_emails' })
export default class PendingShopEmail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  shop_email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userProfileId!: string | null;

  @OneToOne(() => UserProfile)
  @JoinColumn({ name: 'userProfileId', referencedColumnName: 'user_id' })
  userProfile?: UserProfile;

  @Column({ type: 'varchar', length: 255 })
  verification_token!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
