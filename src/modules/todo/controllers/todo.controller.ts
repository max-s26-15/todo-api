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
import { HttpCode } from '@nestjs/common';
import { CreateDto, UpdateDto } from './dto';
import { TodoService } from '../services/todo.service';
import { Todo } from '../entities/todo.entity';
import { Status } from '../status.array';

@Controller('rest/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllActions(): Promise<Todo[]> {
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

    if (createDto.title == null)
      throw new HttpException(
        `Title is required field`,
        HttpStatus.NOT_ACCEPTABLE,
      );

    if (!Status.includes(createDto.status) && createDto.status != null)
      throw new HttpException(
        `Unknown status '${createDto.status}'`,
        HttpStatus.NOT_ACCEPTABLE,
      );

    todo.title = createDto.title;
    todo.status = createDto.status || Status[0];

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

    if (!Status.includes(updateDto.status) && updateDto.status != null)
      throw new HttpException(
        `Unknown status '${updateDto.status}'`,
        HttpStatus.NOT_ACCEPTABLE,
      );

    todo.title = updateDto.title || todo.title;
    todo.status = updateDto.status || todo.status;

    return this.todoService.update(todo);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteAction(@Param('id') id: string): Promise<void> {
    const todo = await this.todoService.findOne(parseInt(id));

    if (!todo)
      throw new HttpException(
        `Todo with id=${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );

    return this.todoService.remove(id);
  }
}