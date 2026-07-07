import { Component, Output, EventEmitter } from '@angular/core';
import { FormField } from '@student-project/shared-interfaces';
import { TASK_FORM_FIELDS } from '@student-project/ui-forms';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  fields: FormField[] = TASK_FORM_FIELDS;
  @Output() save = new EventEmitter<Record<string, unknown>>();
}
