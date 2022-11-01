import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../status.array';
import { User } from '../../user/entities/user.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity('Todos')
export class Todo {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ default: Status[0] })
  status: string;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
