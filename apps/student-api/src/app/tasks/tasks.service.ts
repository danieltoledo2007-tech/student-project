import { Injectable } from '@nestjs/common';
import { Task } from '@student-project/shared-interfaces';
import { CreateTaskDto } from './dto/create-task.dto';
import * as fs from 'fs';
import * as path from 'path';

const TASKS_FILE = path.join(process.cwd(), 'apps', 'student-api', 'tasks.json');

@Injectable()
export class TasksService {
  getAll(): Task[] {
    return fs.existsSync(TASKS_FILE)
      ? JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'))
      : [];
  }

  add(dto: CreateTaskDto): { success: boolean } {
    const tasks = this.getAll();
    tasks.push(dto);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return { success: true };
  }
  getById(id: number): Task[] {
    return this.getAll().filter((task) => task.id === id);
  }

  deleteById(id: number): { success: boolean } {
    const tasks = this.getAll().filter((task) => task.id !== id);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return { success: true };
  }

  toggleCompleted(id: number): { success: boolean } {
    const tasks = this.getAll().map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return { success: true };
  }
  

}