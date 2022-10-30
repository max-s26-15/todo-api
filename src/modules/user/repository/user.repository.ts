import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {}
