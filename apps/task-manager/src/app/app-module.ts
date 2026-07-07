import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFormsModule } from '@student-project/ui-forms';
import { App } from './app';
import { appRoutes } from './app.routes';
import { TasksPage } from './tasks-page/tasks-page';
import { TasksListComponent } from './tasks-page/components/tasks-list/tasks-list.component';
import { TaskItemComponent } from './tasks-page/components/task-item/task-item.component';
import { TaskFormComponent } from './tasks-page/components/task-form/task-form.component';

@NgModule({
  declarations: [
    App,
    TasksPage,
    TasksListComponent,
    TaskItemComponent,
    TaskFormComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    UiFormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
  ],
  bootstrap: [App],
})
export class AppModule {}
