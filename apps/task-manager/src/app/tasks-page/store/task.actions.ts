import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '@student-project/shared-interfaces';

/**
 * ACTIONS = plain events that describe "something happened".
 * Components never change state directly; they dispatch one of these.
 * Each user intention (load / add / delete / toggle) becomes a trio:
 * the request, the success, and the failure.
 */
export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    // load
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    // add
    'Add Task': props<{ task: Task }>(),
    'Add Task Success': emptyProps(),
    'Add Task Failure': props<{ error: string }>(),

    // delete — היה id: number; עכשיו נושא את ה-_id של מונגו (מחרוזת)
    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),

    // toggle completed — היה id: number
    'Toggle Task': props<{ id: string }>(),
    'Toggle Task Success': props<{ id: string }>(),
    'Toggle Task Failure': props<{ error: string }>(),
  },
});
