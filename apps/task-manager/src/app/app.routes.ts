import { Route } from '@angular/router';
import { TasksPage } from './tasks-page/tasks-page';
import { LoginPageComponent } from './auth/login.page/login-page.component';
import { RegisterPageComponent } from './auth/register.page/register-page.component';

export const appRoutes: Route[] = [
 { path: 'login',    component: LoginPageComponent },
{ path: 'register', component: RegisterPageComponent },
{ path: 'tasks',    component: TasksPage },
{ path: '', redirectTo: 'register', pathMatch: 'full' },
];
