import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '@student-project/shared-interfaces';

@Component({
  selector: 'app-tasks-list',
  standalone: false,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  @Input() tasks: Task[] = [];
  // היה EventEmitter<number> — מעביר הלאה _id (מחרוזת)
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<string>();
}
