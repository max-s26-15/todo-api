import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../status.array';
import { User } from '../../user/entities/user.entity';

@Entity('Todos')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: Status[0] })
  status: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
