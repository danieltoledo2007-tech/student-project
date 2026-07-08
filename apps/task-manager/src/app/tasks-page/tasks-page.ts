import { Component, OnInit, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Task } from '@student-project/shared-interfaces';
import { TaskActions } from './store/task.actions';
import { selectAllTasks } from './store/task.selectors';

/**
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

  tasks = toSignal(this.store.select(selectAllTasks), { initialValue: [] });
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
    this.store.dispatch(TaskActions.addTask({ task: value as unknown as Task }));
    this.closeModal();
  }

  deleteTask(id: number): void {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  updateTask(id: number): void {
    this.store.dispatch(TaskActions.toggleTask({ id }));
  }
}
