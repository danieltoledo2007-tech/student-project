import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Task } from '@student-project/shared-interfaces';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('')
  getAll(): Task[] {
    return this.tasksService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Task[] {
    return this.tasksService.getById(Number(id));
  }

  @Post()
  add(@Body() task: CreateTaskDto): { success: boolean } {
    return this.tasksService.add(task);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): { success: boolean } {
    return this.tasksService.deleteById(Number(id));
  }

  @Patch(':id/toggle')
  toggleCompleted(@Param('id',ParseIntPipe) id: number): { success: boolean } {
    return this.tasksService.toggleCompleted(Number(id));
  }
}