import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '@student-project/shared-interfaces';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './task.schema';
import { ITasksService } from './tasks-service.interface';

@Injectable()
export class MongoTasksService implements ITasksService {
  constructor(
    @InjectModel(TaskEntity.name) private taskModel: Model<TaskEntity>,
  ) {}

  async getAll(userId: string): Promise<Task[]> {
    // lean() מחזיר אובייקטים פשוטים (בלי מתודות של mongoose) — מתאים לחוזה
    return this.taskModel.find({ userId }).lean<Task[]>();
  }

  async getById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).lean<Task>();
  }

  async add(dto: CreateTaskDto): Promise<{ success: boolean }> {
    await this.taskModel.create(dto);
    return { success: true };
  }

  async deleteById(id: string): Promise<{ success: boolean }> {
    await this.taskModel.findByIdAndDelete(id);
    return { success: true };
  }

  async toggleCompleted(id: string): Promise<{ success: boolean }> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      return { success: false };
    }
    task.completed = !task.completed;
    await task.save();
    return { success: true };
  }
}
