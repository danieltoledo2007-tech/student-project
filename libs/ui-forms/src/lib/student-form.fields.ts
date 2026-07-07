import { FormField } from '@student-project/shared-interfaces';

export const STUDENT_FORM_FIELDS: FormField[] = [
  { name: 'firstName', label: 'student name', type: 'text', required: true },
  { name: 'age', label: 'age', type: 'number', required: true },
  { name: 'grade', label: 'starting grade', type: 'number', required: false },
];
