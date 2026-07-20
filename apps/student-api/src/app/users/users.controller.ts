import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // מחזיר את המשתמש שנוצר (כולל _id) — כך הלקוח יכול להיכנס מיד בלי מסך לוגין נוסף
  @Post('register')
  register(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.register(user.username, user.password);
  }

  @Post('login')
  async login(@Body() user: CreateUserDto): Promise<UserEntity> {
    // found — תוצאת החיפוש במסד; user הוא רק מה שהלקוח שלח
    const found = await this.userService.login(user.username, user.password);
    if (!found) {
      throw new HttpException({ error: 'invalid username or password' }, 401);
    }
    return found;
  }
}
