import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create.user.dto';

@Controller('rest/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  getOneUser(@Param('id') id: string): Promise<User> {
    return this.userService.findById(parseInt(id));
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    return this.userService.create(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const user = await this.userService.findById(parseInt(id));

    if (!user)
      throw new HttpException(
        `User with id=${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );

    return this.userService.remove(parseInt(id));
  }
}
