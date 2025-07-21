import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'purchases' })
export default class Purchase {
  @PrimaryGeneratedColumn()
  purchase_id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  shop_email!: string;

  @Column({ type: 'varchar', length: 255 })
  product_code!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  purchase_date!: Date;

  @Column({ type: 'varchar', length: 255 })
  first_name!: string;

  @Column({ type: 'varchar', length: 255 })
  last_name!: string;

  @Column({ type: 'varchar', length: 255 })
  study_location!: string;
}
