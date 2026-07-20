import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormField, User } from '@student-project/shared-interfaces';
import { AUTH_FORM_FIELDS } from '@student-project/ui-forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  private http = inject(HttpClient);
private auth = inject(AuthService);
private router = inject(Router);
  fields = signal<FormField[]>(AUTH_FORM_FIELDS);

  message = signal('');

  onSubmit(value: Record<string, unknown>): void {
    this.http.post<User>('/api/users/login', value).subscribe({
       next: (user) => {
  this.auth.setUser(user);
  this.router.navigate(['/tasks']);
},
      error: () => this.message.set('login failed — user or password not right'),
    });
  }
}