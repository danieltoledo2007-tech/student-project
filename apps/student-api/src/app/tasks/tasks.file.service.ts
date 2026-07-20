import { Injectable } from '@nestjs/common';
import { Task } from '@student-project/shared-interfaces';
import { CreateTaskDto } from './dto/create-task.dto';
import { ITasksService } from './tasks-service.interface';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const TASKS_FILE = path.join(process.cwd(), 'apps', 'student-api', 'tasks.json');

/**
 * מימוש הקובץ — הקוד ה"ישן" שקם לתחייה כתקע חוקי לאותו שקע.
 * אין כאן מונגו: הזהות (_id) מיוצרת מקומית עם randomUUID.
 */
@Injectable()
export class FileTasksService implements ITasksService {
  // קריאה גולמית של כל הקובץ — לשימוש פנימי בלבד.
  // המתודות שמוחקות/משכתבות חייבות לראות את *כל* המשימות, לא רק של משתמש אחד
  private async readAll(): Promise<Task[]> {
    return fs.existsSync(TASKS_FILE)
      ? JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'))
      : [];
  }

  async getAll(userId: string): Promise<Task[]> {
    return (await this.readAll()).filter((task) => task.userId === userId);
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = await this.readAll();
    return tasks.find((task) => task._id === id) ?? null;
  }

  async add(dto: CreateTaskDto): Promise<{ success: boolean }> {
    const tasks = await this.readAll();
    tasks.push({ ...dto, _id: randomUUID() });
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return { success: true };
  }

  async deleteById(id: string): Promise<{ success: boolean }> {
    const tasks = (await this.readAll()).filter((task) => task._id !== id);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return { success: true };
  }

  async toggleCompleted(id: string): Promise<{ success: boolean }> {
    const tasks = (await this.readAll()).map((task) =>
      task._id === id ? { ...task, completed: !task.completed } : task,
    );
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return { success: true };
  }
}
