import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormField } from '@student-project/shared-interfaces';
import { STUDENT_FORM_FIELDS } from '@student-project/ui-forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
})
export class Register implements OnInit {
  private http = inject(HttpClient);
  fields = signal<FormField[]>(STUDENT_FORM_FIELDS);
  students = signal<Record<string, string>[]>([]);
  message = signal('');

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.http
      .get<Record<string, string>[]>('/api/students')
      .subscribe((students) => this.students.set(students));
  }

  onSubmit(value: Record<string, unknown>): void {
    this.http.post('/api/students', value).subscribe(() => {
      this.message.set('student registered!');
      this.loadStudents();
    });
  }
}
