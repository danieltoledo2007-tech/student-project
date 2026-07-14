import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '@student-project/shared-interfaces';

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  @Input() task!: Task;
  // היה EventEmitter<number> — הכפתורים משדרים עכשיו את ה-_id (מחרוזת)
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<string>();
}
