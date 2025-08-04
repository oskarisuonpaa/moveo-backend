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

@Entity({ name: 'purchases' })
export default class Purchase {
  @PrimaryGeneratedColumn()
  purchase_id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  purchase_number!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  shop_email!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  userProfileId!: string | null;

  @OneToOne(() => UserProfile)
  @JoinColumn({ name: 'userProfileId', referencedColumnName: 'user_id' })
  userProfile?: UserProfile;

  @Column({ type: 'varchar', length: 255 })
  product_code!: string;

  @Column({ type: 'varchar', length: 255 })
  first_name!: string;

  @Column({ type: 'varchar', length: 255 })
  last_name!: string;

  @Column({ type: 'varchar', length: 255 })
  study_location!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  purchase_date!: Date;

  @Column({ type: 'date' })
  product_start_date!: Date;

  @Column({ type: 'date' })
  product_end_date!: Date;
}
