import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from './user.schema';

// Repository: השכבה היחידה שמותר לה לגעת במונגו.
// שמות המתודות בשפת "אחסון" (create, findBy...) ולא בשפת הפיצ'ר (register, login)
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async create(username: string, password: string): Promise<UserEntity> {
    return this.userModel.create({ username, password });
  }

  // מחזיר את המשתמש (כולל _id) אם השם והסיסמה תואמים, אחרת null
  async findByCredentials( username: string, password: string,): Promise<UserEntity | null> {
    return this.userModel.findOne({ username, password }).lean<UserEntity>();
  }
}
