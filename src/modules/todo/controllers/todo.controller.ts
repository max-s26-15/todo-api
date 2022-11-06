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
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {NotAcceptableResponse, NotFoundResponse} from "../../type";

@ApiTags('Todo')
@Controller('rest/todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Get(':userId')
    @ApiResponse({
        status: 200,
        description: "Get all todos of user by user Id and status.",
        type: Todo,
        isArray: true
    })
    getAllActions(@Param('userId') userId: string, @Query('status') status?: string): Promise<Todo[]> {
        if (status) {
            return this.todoService.findAllByStatus(status, parseInt(userId));
        }

        return this.todoService.findAll(parseInt(userId));
    }

    @Get('/findOne/:userId/:id')
    @ApiResponse({status: 200, description: "Get one todo of user by user Id and todo Id.", type: Todo})
    @ApiResponse({status: 404, description: "Not Found", type: NotFoundResponse})
    async getOneAction(@Param() param): Promise<Todo> {
        const {userId, id} = param;
        const todo = await this.todoService.findOne(parseInt(userId), parseInt(id));

        if (!todo)
            throw new HttpException(
                `Todo with id=${id} does not exist.`,
                HttpStatus.NOT_FOUND,
            );

        return todo;
    }

    @Post(':userId')
    @ApiResponse({status: 201, description: "Create todo for user.", type: Todo})
    @ApiResponse({status: 406, description: "Not Acceptable", type: NotAcceptableResponse})
    @ApiBody({type: CreateDto})
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
    @ApiResponse({status: 200, description: "Put changes in user's todo.", type: Todo})
    @ApiResponse({status: 404, description: "Not Found", type: NotFoundResponse})
    @ApiResponse({status: 406, description: "Not Acceptable", type: NotAcceptableResponse})
    @ApiBody({type: UpdateDto})
    async updateAction(
        @Param() param,
        @Body() updateDto: UpdateDto,
    ): Promise<Todo | { error: boolean }> {
        const {userId, id} = param;
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
    @ApiResponse({status: 200, description: "Delete user's todo."})
    @ApiResponse({status: 404, description: "Not Found", type: NotFoundResponse})
    async deleteAction(@Param() param): Promise<void> {
        const {userId, id} = param;
        const todo = await this.todoService.findOne(parseInt(userId), parseInt(id));

        if (!todo)
            throw new HttpException(
                `Todo with id=${id} does not exist.`,
                HttpStatus.NOT_FOUND,
            );

        return this.todoService.remove(id);
    }
}
