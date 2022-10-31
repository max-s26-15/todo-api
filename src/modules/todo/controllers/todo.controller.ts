import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put, Query,
} from '@nestjs/common';
import {TodoService} from '../services/todo.service';
import {Todo} from '../entities/todo.entity';
import {Status} from '../status.array';
import {CreateDto, UpdateDto} from "../dto/dto";

@Controller('rest/todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Get(':userId')
    getAllActions(@Param('userId') userId: string, @Query('status') status?: string): Promise<Todo[]> {
        if (status) {
            return this.todoService.findAllByStatus(status, parseInt(userId));
        }

        return this.todoService.findAll(parseInt(userId));
    }

    @Get('/findOne/:userId/:id')
    async getOneAction(@Param('userId') userId: string, @Param('id') id: string): Promise<Todo> {
        const todo = await this.todoService.findOne(parseInt(userId), parseInt(id));

        if (!todo)
            throw new HttpException(
                `Todo with id=${id} does not exist.`,
                HttpStatus.NOT_FOUND,
            );

        return todo;
    }

    @Post(':userId')
    createAction(@Body() createDto: CreateDto, @Param('userId') userId: string): Promise<Todo> {

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

        return this.todoService.create(createDto, parseInt(userId));
    }

    @Put(':userId/:id')
    async updateAction(
        @Param('userId') userId: string,
        @Param('id') id: string,
        @Body() updateDto: UpdateDto,
    ): Promise<Todo | { error: boolean }> {
        const todo = await this.todoService.findOne(parseInt(userId), parseInt(id));

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

    @Delete(':userId/:id')
    async deleteAction(@Param('userId') userId: string, @Param('id') id: string): Promise<void> {
        const todo = await this.todoService.findOne(parseInt(userId), parseInt(id));

        if (!todo)
            throw new HttpException(
                `Todo with id=${id} does not exist.`,
                HttpStatus.NOT_FOUND,
            );

        return this.todoService.remove(id);
    }
}
