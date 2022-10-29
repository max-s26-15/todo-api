import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './dto';
import { TodoService } from '../services/todo.service';
import { Todo } from '../entities/todo.entity';

@Controller('rest/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllAction(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  async getOneAction(@Param('id') id: string): Promise<Todo> {
    const todo = await this.todoService.findOne(parseInt(id));

    if (!todo)
      throw new HttpException(
        `Todo with id=${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );

    return todo;
  }

  @Post()
  createAction(@Body() createDto: CreateDto): Promise<Todo> {
    const todo = new Todo();
    todo.title = createDto.title;
    todo.statusId = createDto.statusId || 0;
    return this.todoService.create(todo);
  }

  @Put(':id')
  async updateAction(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<Todo | { error: boolean }> {
    const todo = await this.todoService.findOne(parseInt(id));
    if (!todo)
      throw new HttpException(
        `Todo with id=${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );

    todo.title = updateDto.title || todo.title;
    todo.statusId = updateDto.statusId || todo.statusId;

    return this.todoService.update(todo);
  }

  @Delete(':id')
  deleteAction(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(id);
  }
}
