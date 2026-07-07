import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField } from '@student-project/shared-interfaces';
import { buildFormGroup } from '../build-form';

@Component({
  selector: 'app-generic-form',
  standalone: false,
  templateUrl: './generic-form.component.html',
})
export class GenericFormComponent implements OnChanges {
  @Input() fields: FormField[] = [];
  @Input() submitLabel = 'submit';
  @Output() formSubmit = new EventEmitter<Record<string, unknown>>();

  form: FormGroup = new FormGroup({});

  ngOnChanges(): void {
    this.form = buildFormGroup(this.fields);
  }

  onSubmit(): void {
    this.formSubmit.emit(this.form.value);
    this.form.reset();
  }
}
