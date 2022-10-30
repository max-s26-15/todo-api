import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../status.array';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: Status[0] })
  status: string;
}
