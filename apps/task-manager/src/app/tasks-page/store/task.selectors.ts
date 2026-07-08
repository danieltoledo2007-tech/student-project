import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, TASKS_FEATURE_KEY } from './task.reducer';

/**
 * SELECTORS = read-only queries into the store.
 * Components use these instead of owning the data themselves.
 * Derived values (like a completed count) are computed here, once,
 * instead of being duplicated inside every component.
 */
const selectTasksState = createFeatureSelector<TasksState>(TASKS_FEATURE_KEY);

export const selectAllTasks = createSelector(
  selectTasksState,
  (state) => state.tasks
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.loading
);

export const selectCompletedCount = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter((t) => t.completed).length
);
