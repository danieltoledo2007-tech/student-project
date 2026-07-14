import { FormField } from '@student-project/shared-interfaces';

export const TASK_FORM_FIELDS: FormField[] = [
  // שדה ה-id הוסר מהטופס — המשתמש לא ממציא זהות, מונגו מייצר _id בשרת.
  // היה: { name: 'id', label: 'task id', type: 'number', required: true },
  { name: 'taskname', label: 'task name', type: 'text', required: true },
  { name: 'description', label: 'description', type: 'text', required: false },
  { name: 'completed', label: 'completed', type: 'checkbox', required: false },
];
