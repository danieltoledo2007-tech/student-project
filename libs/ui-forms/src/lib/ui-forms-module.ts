import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericFormComponent } from './generic-form/generic-form.component';

@NgModule({
  declarations: [GenericFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [GenericFormComponent],
})
export class UiFormsModule {}
