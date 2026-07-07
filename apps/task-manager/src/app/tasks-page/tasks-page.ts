import { Component, OnInit, inject, signal } from '@angular/core';
import { Task } from '@student-project/shared-interfaces';
import { TasksFrontService } from './tasks-front.service';

@Component({
  selector: 'app-tasks-page',
  standalone: false,
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage implements OnInit {
  private tasksService = inject(TasksFrontService);

  tasks = signal<Task[]>([]);
  isModalOpen = signal(false);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getAll().subscribe((tasks) => this.tasks.set(tasks));
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  addTask(value: Record<string, unknown>): void {
    this.tasksService.add(value as unknown as Task).subscribe(() => {
      this.closeModal();
      this.loadTasks();
    });
  }

  deleteTask(id: number): void {
    this.tasksService.deleteById(id).subscribe(() => this.loadTasks());
  }

  updateTask(id: number): void {
    this.tasksService.toggle(id).subscribe(() => this.loadTasks());
  }
}
