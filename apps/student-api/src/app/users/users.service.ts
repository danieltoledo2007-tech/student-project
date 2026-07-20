import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto'; 
import { UserEntity} from './user.schema';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  // הזרקה רגילה — בלי @InjectModel! זה התפקיד של ה-repository בלבד
  constructor(private usersRepository:UsersRepository ) {}

  async register(username: string, password: string): Promise<UserEntity> {
    return this.usersRepository.create(username, password);
  }

  async login(username: string, password: string): Promise<UserEntity | null> {
    return this.usersRepository.findByCredentials(username, password);
  }
}