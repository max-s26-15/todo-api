import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './services/todo.service';
import { TodoController } from './controllers/todo.controller';
import {UserModule} from "../user/user.module";
import {TodoRepository} from "./repository/todo.repository";
import {Todo} from "./entities/todo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TodoRepository, Todo]), UserModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
