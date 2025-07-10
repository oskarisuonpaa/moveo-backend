import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'calendars' })
export default class Calendar {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  alias!: string;

  @Column()
  calendarId!: string;
}
