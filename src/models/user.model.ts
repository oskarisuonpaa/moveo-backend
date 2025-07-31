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

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userProfileId!: string | null;

  @OneToOne(() => UserProfile)
  @JoinColumn({ name: 'userProfileId', referencedColumnName: 'user_id' })
  userProfile?: UserProfile;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  googleId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  accessToken!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'bigint', nullable: true })
  tokenExpiryDate!: number | null;
}
