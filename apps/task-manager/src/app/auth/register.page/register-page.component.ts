import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormField, User } from '@student-project/shared-interfaces';
import { AUTH_FORM_FIELDS } from '@student-project/ui-forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  private http = inject(HttpClient);
private router = inject(Router);
  fields = signal<FormField[]>(AUTH_FORM_FIELDS);

  message = signal('');

  onSubmit(value: Record<string, unknown>): void {
    this.http.post<User>('/api/users/register', value).subscribe({
      next: (user) => {this.message.set(`welcome, ${user.username}!`);
       this.router.navigate(['/login']);},
      error: () => this.message.set('registration failed — maybe username is taken?'),
    });
  }
}