import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormField } from '@student-project/shared-interfaces';

export function buildFormGroup(fields: FormField[]): FormGroup {
  const controls = fields.reduce((acc, field) => {
    acc[field.name] = new FormControl(
      '',
      field.required ? Validators.required : null,
    );
    return acc;
  }, {} as Record<string, FormControl>);

  return new FormGroup(controls);
}
