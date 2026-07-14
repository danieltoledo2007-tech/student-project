import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { Task } from '@student-project/shared-interfaces';
import { CreateTaskDto } from './dto/create-task.dto';
import { ITasksService, TASKS_SERVICE } from './tasks-service.interface';

@Controller('tasks')
export class TasksController {
  constructor(
    // @Inject מצביע על הלוקר (זמן ריצה); הטיפוס ITasksService נותן השלמות ובדיקות (זמן קומפילציה)
    @Inject(TASKS_SERVICE) private tasksService: ITasksService,
  ) {}

  @Get('')
  getAll(): Promise<Task[]> {
    return this.tasksService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.getById(id);
  }

  @Post()
  add(@Body() task: CreateTaskDto): Promise<{ success: boolean }> {
    return this.tasksService.add(task);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.tasksService.deleteById(id);
  }

  @Patch(':id/toggle')
  toggleCompleted(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.tasksService.toggleCompleted(id);
  }
}
