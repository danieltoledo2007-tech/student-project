import { Task } from '@student-project/shared-interfaces';
import { CreateTaskDto } from './dto/create-task.dto';

/**
 * החוזה: כל מימוש אחסון (מונגו, קובץ, ובעתיד SQL...) חייב לספק
 * בדיוק את החתימות האלה. אין כאן שום קוד — רק צורות.
 */
export interface ITasksService {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  add(dto: CreateTaskDto): Promise<{ success: boolean }>;
  deleteById(id: string): Promise<{ success: boolean }>;
  toggleCompleted(id: string): Promise<{ success: boolean }>;
}

/**
 * ה"תווית על הלוקר" של ה-DI. חייבים קבוע נפרד כי interface
 * מתאדה בזמן ריצה ולא יכול לשמש מפתח הזרקה בעצמו.
 */
export const TASKS_SERVICE = 'TASKS_SERVICE';

