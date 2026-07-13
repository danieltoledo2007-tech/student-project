import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Task } from '@student-project/shared-interfaces';
import { TaskActions } from './store/task.actions';
// NOT NEEDED ANYMORE — the manual selectors, replaced by tasksFeature:
// import { selectAllTasks, selectTasksLoading } from './store/task.selectors';
import { tasksFeature } from './store/task.feature';

/*
 * REDUX VERSION of the tasks page.
 *
 * Compare with the original (master branch): this component no longer owns
 * the task list, no longer calls the HTTP service, and has no loadTasks().
 * It only:
 *   - reads state from the store via selectors (selectAllTasks)
 *   - announces intent via store.dispatch(...)
 * All the "how" (HTTP, updating the list) lives in the effects + reducer.
 *
 * `toSignal` turns the store Observable into a signal so the existing
 * template (which calls `tasks()`) works without any HTML changes.
 * `isModalOpen` stays a local signal on purpose: it is pure UI state, not
 * shared app state, so it does NOT belong in the global store.
 */
@Component({
  selector: 'app-tasks-page',
  standalone: false,
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage implements OnInit {
  private store = inject(Store);

  // NOT NEEDED ANYMORE — the manual-selector versions:
  // tasks = toSignal(this.store.select(selectAllTasks), { initialValue: [] });
  // loading = toSignal(this.store.select(selectTasksLoading), { initialValue: false });
  // createFeature versions — same behavior, selectors are auto-generated:
  tasks = toSignal(this.store.select(tasksFeature.selectTasks), { initialValue: [] });
  loading = toSignal(this.store.select(tasksFeature.selectLoading), { initialValue: false });
  isModalOpen = signal(false);

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  addTask(value: Record<string, unknown>): void {
    // The generic form emits every field as a string (dynamic [type] binding
    // makes Angular fall back to the DefaultValueAccessor), so coerce the
    // values to the types the server's CreateTaskDto expects.
    const task: Task = {
      id: Number(value['id']),
      taskname: String(value['taskname'] ?? ''),
      description: String(value['description'] ?? ''),
      completed: value['completed'] === true || value['completed'] === 'true',
    };
    this.store.dispatch(TaskActions.addTask({ task }));
    this.closeModal();
  }

  deleteTask(id: number): void {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  updateTask(id: number): void {
    this.store.dispatch(TaskActions.toggleTask({ id }));
  }
}
