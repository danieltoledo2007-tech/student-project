import { Injectable, signal } from '@angular/core';
import { User } from '@student-project/shared-interfaces';

@Injectable()
export class AuthService {
  // מי מחובר עכשיו. null = אף אחד. (בריפרש זה מתאפס — נטפל בזה בעתיד)
  currentUser = signal<User | null>(null);

  // נקרא ברגע לוגין/רגיסטר מוצלח
  setUser(user: User): void {
    this.currentUser.set(user);
  }

  // ה-id לסינון המשימות; undefined אם אף אחד לא מחובר
  userId(): string | undefined {
    return this.currentUser()?._id;
  }
}
