import 'reflect-metadata';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'products' })
export default class Product {
  @PrimaryGeneratedColumn()
  product_id!: number;

  @Column({ type: 'varchar', length: 255 })
  product_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_name_english!: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  product_code!: string;

  @Column({ type: 'date', nullable: true })
  product_start!: Date | null;

  @Column({ type: 'date' })
  product_end!: Date;
}
