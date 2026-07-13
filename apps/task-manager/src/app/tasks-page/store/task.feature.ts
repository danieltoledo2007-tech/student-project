import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Task } from '@student-project/shared-interfaces';
import { TaskActions } from './task.actions';

/**
 * CREATE-FEATURE VERSION — replaces task.reducer.ts + task.selectors.ts.
 *
 * createFeature receives a name + reducer and AUTO-GENERATES a selector
 * for the slice and for every top-level state field:
 *   tasksFeature.selectTasksState  → the whole slice   (from name: 'tasks')
 *   tasksFeature.selectTasks       → state.tasks       (from the field name)
 *   tasksFeature.selectLoading     → state.loading     (from the field name)
 *   tasksFeature.selectError       → state.error       (from the field name)
 * Naming rule: 'select' + field name with a capital first letter.
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

export const tasksFeature = createFeature({
  // the slice name — replaces TASKS_FEATURE_KEY ('tasks')
  name: 'tasks',

  // the reducer — identical to the one that lived in task.reducer.ts
  reducer: createReducer(
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
  ),
});

/**
 * Computed (derived) selectors are the only ones still written by hand —
 * createFeature cannot guess calculations. Note it builds on the
 * auto-generated tasksFeature.selectTasks.
 */
export const selectCompletedCount = createSelector(
  tasksFeature.selectTasks,
  (tasks) => tasks.filter((t) => t.completed).length
);
