import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UiFormsModule } from '@student-project/ui-forms';
import { App } from './app';
import { appRoutes } from './app.routes';
import { TasksPage } from './tasks-page/tasks-page';
import { TasksListComponent } from './tasks-page/components/tasks-list/tasks-list.component';
import { TaskItemComponent } from './tasks-page/components/task-item/task-item.component';
import { TaskFormComponent } from './tasks-page/components/task-form/task-form.component';
// NOT NEEDED ANYMORE — replaced by the createFeature import below:
// import { TASKS_FEATURE_KEY, tasksReducer } from './tasks-page/store/task.reducer';
import { tasksFeature } from './tasks-page/store/task.feature';
import { TaskEffects } from './tasks-page/store/task.effects';
import { LoginPageComponent } from './auth/login.page/login-page.component';
import { RegisterPageComponent } from './auth/register.page/register-page.component';
import { AuthService } from './auth/auth.service';


@NgModule({
  declarations: [
    App,
    TasksPage,
    TasksListComponent,
    TaskItemComponent,
    TaskFormComponent,
    LoginPageComponent,
    RegisterPageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    UiFormsModule,
    RouterModule.forRoot(appRoutes),
    // register the global store + the tasks slice
    StoreModule.forRoot({}),
    // NOT NEEDED ANYMORE — the manual (key + reducer) registration:
    // StoreModule.forFeature(TASKS_FEATURE_KEY, tasksReducer),
    // createFeature version — the feature object carries both name and reducer:
    StoreModule.forFeature(tasksFeature),
    EffectsModule.forRoot([TaskEffects]),
    // enables Redux DevTools time-travel debugging in the browser
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
   
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    AuthService,
  ],
  bootstrap: [App],
})
export class AppModule {}
