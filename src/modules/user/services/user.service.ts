import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: UserRepository) {}

  findAll = (): Promise<User[]> => this.userRepository.find();

  findById = (id: number): Promise<User> =>
    this.userRepository.findOneBy({ id: id });

  create = (user: User): Promise<User> => this.userRepository.save(user);

  remove = async (id: number): Promise<void> => {
    await this.userRepository.delete(id);
  };
}
