import { FormField } from '@student-project/shared-interfaces';

export const AUTH_FORM_FIELDS: FormField[] = [
  { name: 'username', label: 'Username', type: 'text', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
];