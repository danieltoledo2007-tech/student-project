import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '@student-project/shared-interfaces';

@Injectable({
  providedIn: 'root',
})
export class TasksFrontService {
  private http = inject(HttpClient);
  private baseUrl = '/api/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  add(task: Task): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(this.baseUrl, task);
  }

  // היה id: number בשתי הפונקציות — עכשיו _id של מונגו, שהוא מחרוזת
  deleteById(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }

  toggle(id: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.baseUrl}/${id}/toggle`, {});
  }
}
