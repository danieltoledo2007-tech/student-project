import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TasksFrontService } from '../tasks-front.service';
import { TaskActions } from './task.actions';

/**
 * EFFECTS = where the side-effects (HTTP) live, OUTSIDE the components.
 * Pattern: listen for a request action -> call the existing service ->
 * dispatch a success/failure action back into the store.
 * The component that dispatched the action knows nothing about HTTP.
 */
@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksFrontService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.tasksService.getAll().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((err) =>
            of(TaskActions.loadTasksFailure({ error: String(err) }))
          )
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) =>
        this.tasksService.add(task).pipe(
          // server generates the id, so reload the list after a successful add
          map(() => TaskActions.loadTasks()),
          catchError((err) =>
            of(TaskActions.addTaskFailure({ error: String(err) }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.tasksService.deleteById(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((err) =>
            of(TaskActions.deleteTaskFailure({ error: String(err) }))
          )
        )
      )
    )
  );

  toggleTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.toggleTask),
      mergeMap(({ id }) =>
        this.tasksService.toggle(id).pipe(
          map(() => TaskActions.toggleTaskSuccess({ id })),
          catchError((err) =>
            of(TaskActions.toggleTaskFailure({ error: String(err) }))
          )
        )
      )
    )
  );
}
