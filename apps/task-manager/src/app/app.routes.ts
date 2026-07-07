import { Route } from '@angular/router';
import { TasksPage } from './tasks-page/tasks-page';

export const appRoutes: Route[] = [
  { path: '', component: TasksPage },
];
