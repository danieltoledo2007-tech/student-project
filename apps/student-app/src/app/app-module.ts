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
import { Register } from './register/register';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [App, Register],
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
