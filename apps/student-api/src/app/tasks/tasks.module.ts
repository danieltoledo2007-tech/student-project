import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TaskEntity, TaskSchema } from './task.schema';
import { TASKS_SERVICE } from './tasks-service.interface';
import { MongoTasksService } from './tasks.mongo.service';
import { FileTasksService } from './tasks.file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskEntity.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [
    {
      // בחירת התקע לפי apps/.env — STORAGE=mongo או STORAGE=file
      provide: TASKS_SERVICE,
      useClass:
        process.env.STORAGE === 'file' ? FileTasksService : MongoTasksService,
    },
  ],
})
export class TasksModule {}
