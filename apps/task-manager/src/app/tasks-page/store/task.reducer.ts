/**
 * ⚠️ NOT NEEDED ANYMORE — replaced by task.feature.ts (createFeature version).
 * The interface, initialState and reducer below moved into createFeature({...}).
 * TASKS_FEATURE_KEY was replaced by `name: 'tasks'` inside createFeature.
 * Kept only for comparison/learning — safe to delete once you're comfortable.
 */
import { createReducer, on } from '@ngrx/store';
import { Task } from '@student-project/shared-interfaces';
import { TaskActions } from './task.actions';

/**
 * The slice of the global store that belongs to the tasks feature.
 */
export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const TASKS_FEATURE_KEY = 'tasks';

/**
 * REDUCER = a pure function (oldState, action) => newState.
 * It never calls HTTP and never mutates; it returns a brand-new object.
 * Notice delete/toggle update the list locally (no re-fetch needed) —
 * that is one of the concrete wins over the signal version.
 */
export const tasksReducer = createReducer(
  initialState,

  // load
  on(TaskActions.loadTasks, (state) => ({ ...state, loading: true, error: null })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // delete — remove the task from the store directly
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== id),
  })),

  // toggle — flip `completed` on the matching task directly
  on(TaskActions.toggleTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ),
  })),

  // any failure just records the message
  on(
    TaskActions.addTaskFailure,
    TaskActions.deleteTaskFailure,
    TaskActions.toggleTaskFailure,
    (state, { error }) => ({ ...state, error })
  )
);
