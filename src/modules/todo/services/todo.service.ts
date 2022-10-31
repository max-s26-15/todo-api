import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Todo} from '../entities/todo.entity';
import {UserService} from "../../user/services/user.service";
import {CreateDto} from "../dto/dto";
import {Status} from "../status.array";
import {TodoRepository} from "../repository/todo.repository";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo) private todoRepository: TodoRepository,
        private readonly userService: UserService
    ) {
    }

    findAll(userId: number): Promise<Todo[]> {
        return this.todoRepository.find({
            relations: ['user'],
            where: {user: {id: userId}},
        });
    }

    findAllByStatus(status: string, userId: number): Promise<Todo[]> {
        return this.todoRepository.find({
            relations: ['user'],
            where: {user: {id: userId}, status: status},
        });
    }

    findOne(userId:number, id: number): Promise<Todo> {
        return this.todoRepository.findOneBy({id: id, user: {id: userId}});
    }

    async create(createDto: CreateDto, userId: number): Promise<Todo> {
        const todo = new Todo();

        todo.title = createDto.title;
        todo.status = createDto.status || Status[0];
        todo.user = await this.userService.findById(userId);

        return this.todoRepository.save(todo);
    }

    update(todo: Todo): Promise<Todo> {
        return this.todoRepository.save(todo);
    }

    async remove(id: string): Promise<void> {
        await this.todoRepository.delete(id);
    }
}
