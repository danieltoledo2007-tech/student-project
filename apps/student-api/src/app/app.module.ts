import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/student-project'),
    TasksModule,UsersModule
  ],
  controllers: [AppController],
})
export class AppModule {}