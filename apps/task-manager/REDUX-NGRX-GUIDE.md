# מדריך מלא: Redux ו-NgRx בפרויקט ה-task-manager

מסמך זה מסכם את **כל** מה שלמדנו על ניהול מצב עם Redux / NgRx בפרויקט הזה — מהתשתית של הסביבה, דרך כל חלק בקוד, ועד לבאגים אמיתיים שתיקנו והלקחים מהם. הקוד המצוטט לקוח מהפרויקט עצמו, ובמקומות רלוונטיים הוספתי דוגמאות כלליות נוספות.

---

## תוכן עניינים

0. [סביבת הפרויקט (ENV)](#0-סביבת-הפרויקט-env)
1. [מה זה Redux ולמה צריך אותו](#1-מה-זה-redux-ולמה-צריך-אותו)
2. [זרימת המידע החד-כיוונית](#2-זרימת-המידע-החד-כיוונית)
3. [החלקים — משמעות + קוד](#3-החלקים--משמעות--קוד)
4. [המסע המלא של פעולה (toggle)](#4-המסע-המלא-של-פעולה-toggle)
5. [איך קוראים לסלקטורים ואיפה](#5-איך-קוראים-לסלקטורים-ואיפה)
6. [שתי שכבות המצב: סטור מול שרת](#6-שתי-שכבות-המצב-סטור-מול-שרת)
7. [דוגמת ה-loading spinner](#7-דוגמת-ה-loading-spinner)
8. [איך לנפות ולעקוב](#8-איך-לנפות-ולעקוב)
9. [באגים אמיתיים שתיקנו — לקחים](#9-באגים-אמיתיים-שתיקנו--לקחים)
10. [דוגמאות כלליות נוספות](#10-דוגמאות-כלליות-נוספות)
11. [מתי כדאי Redux ומתי מיותר](#11-מתי-כדאי-redux-ומתי-מיותר)
12. [שגיאות נפוצות ו-best practices](#12-שגיאות-נפוצות-ו-best-practices)
13. [מילון מונחים מהיר](#13-מילון-מונחים-מהיר)
14. [העמקה: הסטור — איפה, איך, ומשמעות](#14-העמקה-הסטור--איפה-איך-ומשמעות)
15. [העמקה: סלקטורים — איך עובדים ואיך כותבים](#15-העמקה-סלקטורים--איך-עובדים-ואיך-כותבים)

---

## 0. סביבת הפרויקט (ENV)

לפני ה-Redux — חשוב להבין באיזו סביבה הוא חי.

### מבנה מסוג Monorepo (Nx)
הפרויקט הוא **Nx monorepo** — מאגר אחד שמכיל כמה אפליקציות וספריות משותפות:

```
student-project/
├── apps/
│   ├── task-manager/     ← אפליקציית Angular (הפרונט של המשימות) — כאן ה-NgRx
│   ├── student-app/      ← אפליקציית Angular נוספת (רישום סטודנטים)
│   └── student-api/      ← שרת NestJS משותף (ה-backend)
└── libs/
    ├── shared-interfaces/ ← טיפוסים משותפים (Task, FormField וכו')
    └── ui-forms/          ← רכיב טופס גנרי משותף לשתי האפליקציות
```

**היתרון:** טיפוס כמו `Task` מוגדר **פעם אחת** ב-`shared-interfaces`, וגם הפרונט וגם השרת מייבאים אותו — כך אין סיכון שהם "ידברו" על מבנה נתונים שונה.

### שתי שכבות שרצות במקביל
- **פרונט (task-manager)** — Angular, רץ למשל על פורט 4200.
- **שרת (student-api)** — NestJS, רץ על פורט 3000, שומר נתונים בקובץ `apps/student-api/tasks.json`.

### הפרוקסי — איך הפרונט מדבר עם השרת
בקובץ `apps/task-manager/proxy.conf.json`:
```json
{ "/api": { "target": "http://localhost:3000", "secure": false } }
```
כל בקשה מהפרונט ל-`/api/...` מנותבת אוטומטית לשרת ב-`localhost:3000`. זה פותר בעיות CORS בפיתוח ומאפשר לכתוב בקוד פשוט `/api/tasks` בלי כתובת מלאה.

### הרעיון המרכזי של הסביבה — שתי "אמיתות" של מצב
| שכבה | איפה חי | מתי מתאפס |
|------|---------|-----------|
| **הסטור (NgRx)** | זיכרון הדפדפן | בכל רענון של הדף |
| **`tasks.json`** | דיסק בשרת | אף פעם (עד מחיקה ידנית) |

זו הבחנה שנחזור אליה שוב ושוב: ה-Redux מנהל את המצב **בזיכרון בלבד**. השמירה האמיתית היא בשרת. ה-Effects הם הגשר בין השניים.

---

## 1. מה זה Redux ולמה צריך אותו

**Redux** הוא דפוס (pattern) לניהול מצב (state) של אפליקציה. **NgRx** הוא המימוש הרשמי של הדפוס הזה ל-Angular.

הרעיון המרכזי: במקום שכל קומפוננטה תחזיק ותשנה את הנתונים שלה בעצמה, יש **מקור אמת יחיד** (single source of truth) — ה-Store — וכל שינוי עובר דרך נתיב אחד, קבוע וצפוי.

בגרסה הרגילה (בלי Redux) הקומפוננטה החזיקה את הרשימה, קראה ל-HTTP, ועדכנה את עצמה. בגרסת ה-Redux הקומפוננטה נהיית "רזה":
- היא רק **קוראת** מצב (דרך selectors).
- היא רק **מכריזה על כוונה** (דרך dispatch של actions).
- כל ה"איך" (HTTP, עדכון הרשימה) קורה במקום אחר.

---

## 2. זרימת המידע החד-כיוונית

הלב של Redux הוא **מעגל חד-כיווני** שאי אפשר לקצר בו פינות:

```
Component
  │  dispatch(Action)
  ▼
Action ──► Reducer ──► Store ──► Selector ──► Component (מתעדכן)
   │
   └──► Effect ──► שרת (HTTP) ──► Success Action ──► Reducer ──► ...
```

הכלל: כל שינוי מצב **חייב** לעבור: `dispatch → (effect אם צריך HTTP) → reducer → store → selector → component`. אין קומפוננטה שמשנה את הסטור "בצד".

---

## 3. החלקים — משמעות + קוד

### 3.1 Actions — האירועים ("מה קרה")
קובץ: `apps/task-manager/src/app/tasks-page/store/task.actions.ts`

Action הוא אובייקט פשוט שמתאר ש"משהו קרה". הקומפוננטה אף פעם לא משנה מצב ישירות — היא רק שולחת (`dispatch`) action.

```ts
export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    // כל פעולה = שלישייה: בקשה / הצלחה / כישלון
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    'Add Task': props<{ task: Task }>(),
    'Add Task Success': emptyProps(),
    'Add Task Failure': props<{ error: string }>(),

    'Delete Task': props<{ id: number }>(),
    'Delete Task Success': props<{ id: number }>(),
    'Delete Task Failure': props<{ error: string }>(),

    'Toggle Task': props<{ id: number }>(),
    'Toggle Task Success': props<{ id: number }>(),
    'Toggle Task Failure': props<{ error: string }>(),
  },
});
```

**נקודות מפתח:**
- `emptyProps()` = action בלי נתונים נלווים. `props<{...}>()` = מגדיר את הנתונים שה-action נושא.
- כל פעולה אסינכרונית מקבלת **שלישייה**: הבקשה מפעילה, וה-Success/Failure מדווחים על התוצאה.
- `createActionGroup` הופך אוטומטית `'Toggle Task Success'` ל-`TaskActions.toggleTaskSuccess`.
- `source: 'Tasks'` = תווית שמופיעה בשם ה-action (למשל `[Tasks] Load Tasks`) ומקלה על זיהוי ב-DevTools.

### 3.2 Reducer — המקום היחיד שמשנה את הסטור
קובץ: `task.reducer.ts`

ה-Reducer הוא **פונקציה טהורה**: `(מצב ישן, action) => מצב חדש`. הוא אף פעם לא קורא ל-HTTP ואף פעם לא משנה (mutate) את המצב — תמיד מחזיר אובייקט חדש.

```ts
export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const initialState: TasksState = { tasks: [], loading: false, error: null };
export const TASKS_FEATURE_KEY = 'tasks';   // ה"כתובת" של הפרוסה בסטור

export const tasksReducer = createReducer(
  initialState,

  on(TaskActions.loadTasks, (state) => ({ ...state, loading: true, error: null })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, loading: false })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // delete — מסירים מהרשימה מקומית, בלי לבקש שוב מהשרת
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t.id !== id),
  })),

  // toggle — הופכים את completed מקומית
  on(TaskActions.toggleTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  })),

  // כישלונות — רק רושמים את השגיאה
  on(TaskActions.addTaskFailure, TaskActions.deleteTaskFailure, TaskActions.toggleTaskFailure,
     (state, { error }) => ({ ...state, error })),
);
```

**נקודות מפתח:**
- `...state` יוצר עותק חדש — אין mutation. `filter`/`map` מחזירים מערך חדש.
- `TASKS_FEATURE_KEY = 'tasks'` היא המחרוזת שמחברת בין ה-Reducer, הרישום ב-Module, וה-Selectors. שלושתם חייבים להשתמש באותה מחרוזת.
- delete ו-toggle מעדכנים את הרשימה **מקומית** בזיכרון — אין צורך לרענן מהשרת. זה יתרון קונקרטי.
- `on(...)` אחד יכול לטפל בכמה actions שחולקים לוגיקה (ראה מטפל הכישלונות).

### 3.3 Effects — הצד-אפקטים (HTTP)
קובץ: `task.effects.ts`

Effect מאזין לזרם ה-actions, מבצע את ה-HTTP האמיתי, ומחזיר action של הצלחה/כישלון. ה-HTTP חי כאן — **מחוץ** לקומפוננטות ומחוץ ל-Reducer.

```ts
@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksFrontService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),                        // מסנן: רק ה-action הזה
      switchMap(() =>
        this.tasksService.getAll().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),   // הצלחה → action חדש
          catchError((err) => of(TaskActions.loadTasksFailure({ error: String(err) }))),
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) =>
        this.tasksService.add(task).pipe(
          map(() => TaskActions.loadTasks()),   // השרת מייצר id → מרעננים את הרשימה
          catchError((err) => of(TaskActions.addTaskFailure({ error: String(err) }))),
        )
      )
    )
  );

  // deleteTask$ ו-toggleTask$ באותה תבנית: ofType → mergeMap(service) → map(success) / catchError
}
```

**נקודות מפתח:**
- `ofType(...)` = החיבור בין action ל-effect. רק ה-action התואם מפעיל את השרשרת.
- **`switchMap` מול `mergeMap`**: ב-`loadTasks` משתמשים ב-`switchMap` (טעינה חדשה מבטלת קודמת). ב-`addTask`/`delete`/`toggle` משתמשים ב-`mergeMap` (לא רוצים לבטל — כל פעולה חשובה). ראה הרחבה בסעיף 10.
- ב-`addTask` — אחרי הוספה מוצלחת שולחים `loadTasks()` שוב במקום `addTaskSuccess`, כי ה-id נוצר בשרת ורוצים לקבל את המשימה עם ה-id הנכון.

### 3.4 Selectors — הקריאה מהסטור
קובץ: `task.selectors.ts`

Selector הוא שאילתה (read-only) לתוך הסטור. הקומפוננטות משתמשות בסלקטורים במקום להחזיק את הנתונים בעצמן.

```ts
const selectTasksState = createFeatureSelector<TasksState>(TASKS_FEATURE_KEY);

export const selectAllTasks = createSelector(selectTasksState, (state) => state.tasks);
export const selectTasksLoading = createSelector(selectTasksState, (state) => state.loading);

// ערך נגזר — מחושב פעם אחת כאן, לא בכל קומפוננטה
export const selectCompletedCount = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter((t) => t.completed).length,
);
```

**נקודות מפתח:**
- `createFeatureSelector<TasksState>(TASKS_FEATURE_KEY)` — משתמש באותו `'tasks'` מה-Reducer. זו החוליה שמצמידה את הסלקטור לפרוסה הנכונה.
- סלקטורים **ממומוריזים (memoized)** — `selectCompletedCount` ירוץ מחדש רק אם רשימת המשימות באמת השתנתה, לא בכל שינוי אחר בסטור.

### 3.5 חיווט ב-Module
קובץ: `app-module.ts`

כאן כל החלקים מחוברים למערכת:
```ts
imports: [
  StoreModule.forRoot({}),                               // הסטור הגלובלי
  StoreModule.forFeature(TASKS_FEATURE_KEY, tasksReducer), // מחבר את פרוסת 'tasks' ל-reducer
  EffectsModule.forRoot([TaskEffects]),                  // מפעיל את האפקטים
  StoreDevtoolsModule.instrument({ maxAge: 25 }),        // Redux DevTools (time-travel)
],
providers: [ provideHttpClient() ],                      // נחוץ ל-HTTP באפקטים
```

**נקודות מפתח:**
- `forRoot({})` יוצר את הסטור הריק. `forFeature(...)` רושם את פרוסת ה-tasks.
- בלי `EffectsModule.forRoot([TaskEffects])` — ה-dispatch יגיע ל-Reducer, אבל שום HTTP לא יקרה.

### 3.6 הקומפוננטה
קובץ: `tasks-page.ts`

ההדגמה הטובה ביותר לרעיון: הקומפוננטה רק קוראת מצב ומכריזה על כוונות.

```ts
export class TasksPage implements OnInit {
  private store = inject(Store);

  tasks = toSignal(this.store.select(selectAllTasks), { initialValue: [] });
  loading = toSignal(this.store.select(selectTasksLoading), { initialValue: false });
  isModalOpen = signal(false);   // state מקומי — UI טהור, לא בסטור

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());   // הניצוץ שמתחיל את המעגל
  }

  addTask(value: Record<string, unknown>): void {
    // הטופס הגנרי שולח מחרוזות → ממירים לטיפוסים שהשרת דורש
    const task: Task = {
      id: Number(value['id']),
      taskname: String(value['taskname'] ?? ''),
      description: String(value['description'] ?? ''),
      completed: value['completed'] === true || value['completed'] === 'true',
    };
    this.store.dispatch(TaskActions.addTask({ task }));
    this.closeModal();
  }

  deleteTask(id: number): void { this.store.dispatch(TaskActions.deleteTask({ id })); }
  updateTask(id: number): void { this.store.dispatch(TaskActions.toggleTask({ id })); }
}
```

**נקודות מפתח:**
- `toSignal(this.store.select(...))` הופך את ה-Observable של הסטור ל-signal, כך שה-HTML קורא `tasks()`.
- `isModalOpen` נשאר signal **מקומי** בכוונה — זה state של UI, לא state משותף. **לא כל דבר צריך להיכנס לסטור.**

---

## 4. המסע המלא של פעולה (toggle)

נעקוב אחרי לחיצה על "update" על משימה עם `id: 2`. **נקודה חשובה שקל לפספס:** כל action עובר קודם דרך ה-Reducer, ורק אחר כך ל-Effects.

| # | מה קורה | מה ה-Reducer עושה |
|---|---------|-------------------|
| 1 | `dispatch(toggleTask({ id: 2 }))` | — |
| 2 | **ה-action הרגיל מגיע ל-Reducer מיד** | מחפש `on(toggleTask, ...)` — **אין כזה!** אז המצב לא משתנה |
| 3 | (במקביל) ה-Effect תופס `toggleTask` | מתחיל HTTP: `PATCH /api/tasks/2/toggle` |
| 4 | השרת שומר ב-`tasks.json`, מחזיר `{success:true}` | — |
| 5 | ה-Effect פולט `toggleTaskSuccess({ id: 2 })` | — |
| 6 | ה-Success מגיע ל-Reducer | `on(toggleTaskSuccess, ...)` → הופך את `completed` |
| 7 | `selectAllTasks` פולט רשימה חדשה → `tasks()` מתעדכן → ה-UI מצויר מחדש | — |

**העיקרון:** כל action עובר דרך ה-Reducer ראשון. אם יש `on(...)` תואם — המצב משתנה; אם אין — נשאר. השוואה מחדדת:
- `loadTasks` (בקשה) → **כן** יש מטפל שמדליק `loading: true` → הספינר מופיע מיד.
- `toggleTask` (בקשה) → **אין** מטפל → כלום לא קורה עד אישור השרת.

---

## 5. איך קוראים לסלקטורים ואיפה

### איך "מזמנים" סלקטור
```ts
// 1. Observable
this.store.select(selectAllTasks)                 // → Observable<Task[]>

// 2. Signal ישירות (מומלץ, NgRx 16+) — נקי יותר מ-toSignal(store.select(...))
tasks = this.store.selectSignal(selectAllTasks);

// 3. קריאה חד-פעמית (snapshot)
this.store.select(selectAllTasks).pipe(take(1)).subscribe(tasks => { /* פעם אחת */ });
```

### איפה מגדירים
בקובץ `*.selectors.ts` בתיקיית ה-store של הפיצ'ר — קרוב ל-Reducer (הם תלויים במבנה `TasksState` שלו), עם `export` כדי שכל קומפוננטה תוכל לייבא.

### איפה קוראים
- **בקומפוננטה** (מתאים לאפליקציה קטנה — מה שיש כאן).
- **דרך Facade Service** (מתאים לאפליקציות גדולות) — שירות שעוטף את כל הגישה לסטור, והקומפוננטה מדברת רק איתו:

```ts
@Injectable({ providedIn: 'root' })
export class TasksFacade {
  private store = inject(Store);
  tasks = this.store.selectSignal(selectAllTasks);
  completedCount = this.store.selectSignal(selectCompletedCount);
  load() { this.store.dispatch(TaskActions.loadTasks()); }
  toggle(id: number) { this.store.dispatch(TaskActions.toggleTask({ id })); }
}
```
**היתרון:** הקומפוננטה בכלל לא יודעת ש-NgRx קיים — אם תחליף מנגנון, תשנה רק את ה-Facade.

---

## 6. שתי שכבות המצב: סטור מול שרת

זו אחת הנקודות החשובות ביותר.

- **הסטור (NgRx)** — בזיכרון הדפדפן. מתאפס ברענון.
- **`tasks.json`** — בדיסק בשרת. שורד רענון.

בכל פעולה יש **שני עדכונים נפרדים** של אותו שינוי:
- **בשרת** (`fs.writeFileSync` ב-`tasks.service.ts`) — מה ששורד.
- **בסטור** (`on(...)` ב-reducer) — מה שה-UI מצייר.

**הסדר קריטי:** הסטור מתעדכן **רק אחרי** שהשרת אישר. אם השרת נכשל, מגיע action של `Failure` שרק רושם `error`, והסטור **לא** משתנה — כך שתי השכבות נשארות מסונכרנות ולא "משקרות" למשתמש.

---

## 7. דוגמת ה-loading spinner

הספינר ממחיש למה שמנו את `loading` בסטור מלכתחילה. הכל כבר היה מוכן — רק היינו צריכים "לחבר" אותו.

**בתבנית** (`tasks-page.html`):
```html
<img *ngIf="loading()" src="loading.svg" alt="loading" />
```
(הקובץ `loading.svg` יושב ב-`apps/task-manager/public/` ומוגש משורש האתר.)

**מתי הספינר מופיע?** `loading` נהיה `true` **רק** ב-`on(loadTasks, ...)` ב-reducer. אז הספינר מופיע בדיוק כש-`loadTasks` נשלח, וזה קורה בשני מקומות בלבד:
1. **טעינת הדף** — `ngOnInit` שולח `loadTasks()`.
2. **אחרי הוספת משימה** — האפקט של add שולח `loadTasks()` מחדש.

**לא** מופיע ב-delete/toggle, כי הם מעדכנים את הסטור מקומית ולא מריצים `loadTasks`.

> הערה: כיוון שהנתונים מגיעים מקובץ JSON מקומי, הטעינה מהירה מאוד והספינר מהבהב למילישניות. כדי לראות אותו: DevTools → Network → throttling ("Slow 3G").

---

## 8. איך לנפות ולעקוב

### שיטת "המעקב אחורה"
כדי להבין מתי משהו קורה (למשל הספינר), עוקבים אחורה אחרי המשתנה:
```
loading() ב-HTML
  └─ תלוי ב-state.loading
       └─ נהיה true רק ב-on(loadTasks)   ← חפש "loading: true" ב-reducer, מקום אחד
            └─ loadTasks נשלח רק ב-2 מקומות ← חפש "loadTasks()" בקוד
```
פשוט `Grep` / חיפוש גלובלי על המשתנה, ותראה (א) איפה הוא משתנה ב-reducer, (ב) איפה ה-action שלו נשלח.

### Redux DevTools
בזכות `StoreDevtoolsModule` — תוסף הדפדפן מראה כל action, את המצב לפני ואחרי, ומאפשר "מסע בזמן" (לחזור אחורה בין מצבים). כלי הדיבוג החזק ביותר של NgRx.

---

## 9. באגים אמיתיים שתיקנו — לקחים

### באג 1: הוספת משימה נכשלה (400) בגלל טיפוסים
**הבעיה:** השרת מריץ `ValidationPipe` גלובלי, וה-`CreateTaskDto` דורש `@IsNumber() id` ו-`@IsBoolean() completed`. אבל הטופס שלח `id` ו-`completed` כמחרוזות → הבקשה נדחתה עם 400 → כלום לא נשמר, וה-UI לא הראה כלום (השגיאה נרשמה בשקט בסטור).
**למה toggle עבד?** כי toggle הוא `PATCH` עם `id` מה-URL וגוף ריק — הוא לא עובר דרך ה-DTO.
**התיקון:** המרת טיפוסים ב-`addTask` לפני ה-dispatch (`Number(...)`, בוליאני).
**לקח:** ה-Reducer/Effect תופסים שגיאות בשקט — תמיד תבדוק את לשונית Network כשמשהו "לא קורה".

### באג 2: הצ'קבוקס תמיד שלח "לא הושלם"
**הבעיה:** בטופס הגנרי `<input [type]="field.type">` — ה-type **דינמי**. Angular בוחר את מנגנון הערכים (ValueAccessor) לפי type **סטטי** בזמן קומפילציה. עם type דינמי הוא נופל ל-`DefaultValueAccessor` שמחזיר מחרוזת ולא יודע לקרוא מצב צ'קבוקס → `completed` תמיד `''`.
**התיקון:** לרנדר צ'קבוקס עם `type="checkbox"` **סטטי** (בעזרת `*ngIf`), כך Angular בוחר את `CheckboxControlValueAccessor` שמחזיר בוליאני אמיתי.
**לקח:** value accessors ב-Angular נקבעים לפי הסלקטור הסטטי בתבנית, לא לפי ערך דינמי.

### באג 3: התמונה לא הופיעה
**הבעיה:** ה-`src` הצביע לעמוד מכירה של istockphoto (לא קובץ תמונה), ולא היה קובץ מקומי.
**התיקון:** יצירת `public/loading.svg` (ספינר SVG עצמאי) והפניה אליו ב-`src="loading.svg"`.
**לקח:** `<img src>` צריך כתובת שמחזירה **בייטים של תמונה**; assets ב-Angular מוגשים מתיקיית `public/`.

### עניין פתוח: ייחודיות ה-id
ה-`id` מוקלד ידנית, והשרת (`tasks.service.add`) רק עושה `push` בלי לייצר id או לבדוק ייחודיות. הקלדת id קיים יוצרת כפילויות ש-toggle/delete יפגעו בכולן יחד. פתרון עתידי אפשרי (בלי לגעת בשרת): לייצר id ייחודי בצד הלקוח לפני השליחה.

---

## 10. דוגמאות כלליות נוספות

### דוגמה מינימלית: counter (להבנת הדפוס בקטן)
```ts
// actions
export const increment = createAction('[Counter] Increment');
export const addBy = createAction('[Counter] Add', props<{ amount: number }>());

// reducer
export const counterReducer = createReducer(0,
  on(increment, (count) => count + 1),
  on(addBy, (count, { amount }) => count + amount),
);

// component
count = this.store.selectSignal(selectCount);
this.store.dispatch(increment());
this.store.dispatch(addBy({ amount: 5 }));
```

### אופרטורי ה"השטחה" של RxJS באפקטים
הבחירה משנה התנהגות כשמגיעות כמה פעולות במהירות:

| אופרטור | התנהגות | מתי להשתמש |
|---------|---------|------------|
| `switchMap` | מבטל בקשה קודמת כשמגיעה חדשה | טעינה/חיפוש — רק האחרון חשוב |
| `mergeMap` | מריץ הכל במקביל | הוספה/מחיקה — כל פעולה חשובה |
| `concatMap` | מריץ בתור, אחד אחרי השני | כשהסדר קריטי |
| `exhaustMap` | מתעלם מחדשות עד שהנוכחית נגמרה | כפתור "שמור"/login — למנוע לחיצות כפולות |

### `@ngrx/entity` — לרשימות גדולות
במקום לנהל `Task[]` ידנית עם `filter`/`map`, ה-`EntityAdapter` נותן פעולות מוכנות (`addOne`, `updateOne`, `removeOne`) ומחזיק את הנתונים כ-dictionary לפי id ליעילות. שווה להכיר כשהרשימות גדלות.

### `@ngrx/signals` (SignalStore) — הגישה החדשה
NgRx מודרני מציע גם `SignalStore` — גישה מבוססת signals עם פחות boilerplate (בלי הפרדה נוקשה ל-actions/reducers/effects). כדאי להכיר כאלטרנטיבה עתידית, אבל ה-Store הקלאסי (שלמדנו) עדיין הנפוץ והבסיסי להבנת הדפוס.

---

## 11. מתי כדאי Redux ומתי מיותר

**מה Redux נותן:**
1. מקור אמת יחיד — כמה מסכים רואים אותו מצב מסונכרן.
2. זרימה חד-כיוונית וצפויה — קל לאתר תקלות.
3. הפרדת אחריות נקייה — כל קובץ עושה דבר אחד.
4. קלות בדיקה — ה-Reducer פונקציה טהורה, בודקים בלי דפדפן/שרת.
5. Time-travel debugging עם DevTools.
6. ערכים נגזרים מחושבים פעם אחת (selectors ממומוריזים).

**המחיר:** הרבה קוד תשתית (4 קבצים במקום קומפוננטה אחת).

**שורה תחתונה:** לאפליקציה קטנה כמו זו — Redux הוא בעצם *overkill*, וזה תרגיל לימודי. הערך שלו מתחיל להשתלם כשהאפליקציה גדלה: הרבה מסכים שחולקים מצב, לוגיקה אסינכרונית מורכבת, צוות גדול, וצורך בכלי דיבוג.

---

## 12. שגיאות נפוצות ו-best practices

- **אל תשנה (mutate) את ה-state ב-reducer.** תמיד `{ ...state }` / `map` / `filter` — לא `state.tasks.push()`.
- **אל תשים HTTP ב-reducer.** צד-אפקטים שייכים ל-Effects בלבד.
- **לא כל דבר צריך להיכנס לסטור.** state של UI טהור (מודל פתוח/סגור) נשאר signal מקומי.
- **תמיד טפל בכישלון** (`catchError` באפקט → action של Failure). אחרת שגיאות "נעלמות".
- **סלקטורים במקום גישה ישירה** — אל תקרא `state.tasks` בקומפוננטה; עבור דרך selector.
- **בחר את אופרטור ה-RxJS הנכון** באפקט (ראה טבלה בסעיף 10).
- **אותו `FEATURE_KEY`** בשלושה מקומות (reducer, module, selectors) — טעות כאן = הסטור לא נמצא.
- **`selectSignal` על פני `toSignal(store.select(...))`** בפרויקטים חדשים — קצר ונקי יותר.

---

## 13. מילון מונחים מהיר

| מונח | במשפט אחד |
|------|-----------|
| **Store** | הזיכרון המרכזי היחיד (single source of truth) בצד הלקוח. |
| **Action** | אובייקט שמתאר "מה קרה". נשלח עם `dispatch`. |
| **Reducer** | פונקציה טהורה שמחזירה מצב חדש. המקום היחיד שמשנה את הסטור. |
| **Effect** | מאזין ל-action, מבצע צד-אפקט (HTTP), ומחזיר action של תוצאה. |
| **Selector** | שאילתת קריאה מהסטור, ממומוריזת. |
| **Feature Key** | המחרוזת ('tasks') שמצמידה reducer + selectors לאותה פרוסה. |
| **dispatch** | "אני מכריז שקרה אירוע X." |
| **props** | הנתונים ש-action נושא איתו. |
| **memoization** | selector מחשב מחדש רק כשהקלט שלו השתנה. |
| **toSignal / selectSignal** | הופכים את מצב הסטור ל-signal של Angular לתבנית. |

---

---

## 14. העמקה: הסטור — איפה, איך, ומשמעות

### 14.1 מה הסטור *הוא* באמת
הסטור הוא **אובייקט JavaScript אחד** שמחזיק את כל המצב של האפליקציה בעץ אחד:
```ts
{
  tasks: { tasks: [...], loading: false, error: null },   // הפרוסה שלנו
  // אם היו עוד פיצ'רים, כל אחד היה פרוסה נוספת כאן
}
```
זה לא מסד נתונים ולא מבנה קסום — סתם אובייקט. מה שהופך אותו ל"סטור" זה **הכללים** סביבו: משנים אותו רק דרך reducer, קוראים אותו רק דרך selector, והוא היחיד (single source of truth).

### 14.2 איפה בדיוק הוא נשמר
- **בזיכרון הדפדפן (RAM)** — ב-heap של הטאב הפתוח. אין דיסק, אין localStorage, אין קובץ.
- **בתוך `BehaviorSubject` של RxJS** — מחלקת `State` הפנימית של NgRx עוטפת את האובייקט ב-Subject. זה מה שמאפשר "להאזין" לשינויים (וזה מנוע התגובתיות של selectors/signals).
- **מופע יחיד (singleton)** — שירות ה-`Store` נוצר פעם אחת ב-bootstrap דרך ה-Dependency Injection, וחי כל עוד האפליקציה רצה.
- **נדיף** — ברענון (F5) הכל נמחק וחוזר ל-`initialState`. לכן `ngOnInit` שולח `loadTasks()` בכל טעינה, כדי למלא מחדש מהשרת.

### 14.3 המבנה — פרוסות (slices)
הסטור הגלובלי מורכב מפרוסות, כל פיצ'ר ופרוסה משלו. הפרוסה שלנו רשומה תחת המפתח `'tasks'` (`TASKS_FEATURE_KEY`). המחרוזת הזו היא ה"כתובת" של הפרוסה, והיא מופיעה בשלושה מקומות שחייבים להתאים:
1. ב-reducer: `export const TASKS_FEATURE_KEY = 'tasks'`
2. ב-module: `StoreModule.forFeature(TASKS_FEATURE_KEY, tasksReducer)`
3. ב-selectors: `createFeatureSelector<TasksState>(TASKS_FEATURE_KEY)`

### 14.4 איך המידע *נכנס* לסטור
המידע לא נכנס ישירות — הוא עובר מסלול קבוע:
```
dispatch(action) → Effect עושה FETCH → dispatch(successAction) → Reducer כותב לסטור
```
ה-**fetch** (דרך `HttpClient` בשירות) מביא נתונים מהשרת, וה-**reducer** הוא היחיד שמכניס אותם לסטור. אף אחד אחר לא כותב לסטור.

### 14.5 איך *ניגשים* למידע שבסטור
דרך שירות ה-`Store` שמזריקים לקומפוננטה (`private store = inject(Store)`):
```ts
// 1. Observable — נשמע לשינויים לאורך זמן
this.store.select(selectAllTasks)              // Observable<Task[]>

// 2. Signal — הדרך המודרנית (NgRx 16+)
this.store.selectSignal(selectAllTasks)        // Signal<Task[]>

// 3. subscribe ידני — לתגובה בכל שינוי (זכור להתנתק)
this.store.select(selectAllTasks).subscribe(tasks => { ... })

// 4. Snapshot — ערך נוכחי פעם אחת
this.store.select(selectAllTasks).pipe(take(1)).subscribe(tasks => { ... })
```
**חשוב:** תמיד ניגשים דרך selector, לא "חופרים" לתוך `state.tasks.tasks` ידנית.

### 14.6 המשמעות של Redux ושל הסטור — התמונה הגדולה
דמיין את הסטור כ**לוח מחיק (whiteboard) בזיכרון הדפדפן**:
- **הלוח = הסטור.** יושב ב-RAM, נדיף, מקום אחד מרכזי.
- **fetch = שליח** שרץ לשרת (`tasks.json`), מעתיק נתונים, וכותב אותם על הלוח (דרך effect→reducer).
- **selector = מי שקורא** חתיכה מהלוח. לא רץ לשרת, לא כותב — רק קורא.

המשמעות של Redux היא שכל שינוי במצב עובר במסלול **אחד, חד-כיווני וצפוי**: אתה מכריז על כוונה (action), המערכת מעבדת אותה במקום קבוע (reducer/effect), הלוח מתעדכן, וכל מי שקורא ממנו (selectors→components) מתעדכן אוטומטית. אין קומפוננטה שמשנה נתונים "בצד", אין שני מקורות שסותרים זה את זה. זו כל המהות: **מקור אמת יחיד + מסלול שינוי יחיד.**

### 14.7 שתי שכבות — הסטור מול השרת
| שכבה | איפה | תפקיד | מתי מתאפס |
|------|------|-------|-----------|
| הסטור | RAM בדפדפן | מצב מהיר לתצוגה | ברענון |
| `tasks.json` | דיסק בשרת | שמירה אמיתית | אף פעם |
ה-fetch הוא הגשר: מעתיק מהשרת אל הסטור, ומעדכן את השרת כשמשנים.

---

## 15. העמקה: סלקטורים — איך עובדים ואיך כותבים

### 15.1 מה סלקטור *הוא*
סלקטור הוא **פונקציה טהורה שקוראת חתיכה מהסטור**. קלט: המצב הנוכחי. פלט: החתיכה שביקשת (או ערך מחושב ממנה). הוא **אף פעם לא משנה** מצב — רק קורא.

### 15.2 שני סוגי סלקטורים
```ts
// createFeatureSelector — "תן לי את כל הפרוסה של הפיצ'ר לפי המפתח שלו"
const selectTasksState = createFeatureSelector<TasksState>('tasks');

// createSelector — "מתוך פרוסה (או סלקטור אחר), תן לי חתיכה / חשב ערך"
export const selectAllTasks = createSelector(selectTasksState, (s) => s.tasks);
```
`createFeatureSelector` הוא **נקודת ההתחלה** (מאיתר את הפרוסה בסטור). `createSelector` בונה עליו.

### 15.3 הרכבה (composition) — סלקטור על סלקטור
סלקטורים נבנים זה על זה. הפרמטרים הראשונים של `createSelector` הם סלקטורים אחרים, והאחרון הוא פונקציה שמקבלת את הפלטים שלהם:
```ts
export const selectCompletedCount = createSelector(
  selectAllTasks,                             // תלוי בסלקטור אחר
  (tasks) => tasks.filter((t) => t.completed).length,   // מחשב ממנו
);
```
אפשר גם לשלב כמה:
```ts
export const selectVisibleTasks = createSelector(
  selectAllTasks,
  selectFilter,                               // סלקטור נוסף
  (tasks, filter) => tasks.filter((t) => matches(t, filter)),
);
```

### 15.4 Memoization — איך זה עובד ולמה חשוב
`createSelector` **שומר את התוצאה האחרונה**. בכל קריאה הוא בודק אם הקלטים (הפלטים של הסלקטורים שהוא תלוי בהם) השתנו — **לפי השוואת reference** (`===`):
- אם הקלטים **זהים** לקריאה הקודמת → מחזיר את התוצאה השמורה, בלי לחשב מחדש.
- אם קלט **השתנה** → מחשב מחדש ושומר.

לכן `selectCompletedCount` יספור מחדש **רק** אם `tasks` השתנה, ולא אם `loading` השתנה. זה חוסך חישובים, וגם מונע רינדורים מיותרים. **בגלל זה חשוב שה-reducer מחזיר אובייקטים חדשים** (`...state`) — כך ה-reference משתנה רק כשבאמת משהו השתנה, וה-memoization עובד נכון.

### 15.5 דרכים לכתוב ולקרוא סלקטורים
```ts
// א. סלקטור מוגדר (מומלץ) — memoized, מטויפס, מבודד
export const selectAllTasks = createSelector(selectTasksState, (s) => s.tasks);
tasks = this.store.selectSignal(selectAllTasks);

// ב. inline projector — בלי סלקטור נפרד (לא ממומרז, לא מטויפס היטב)
tasks = this.store.selectSignal((state: any) => state.tasks.tasks);

// ג. selectSignal מול toSignal(select(...)) — שקולים, הראשון קצר יותר
tasks = this.store.selectSignal(selectAllTasks);
tasks = toSignal(this.store.select(selectAllTasks), { initialValue: [] });
```

### 15.6 איפה מגדירים ואיפה קוראים
- **מגדירים** בקובץ `*.selectors.ts` בתיקיית ה-store של הפיצ'ר — קרוב ל-reducer (תלוי במבנה `TasksState`), עם `export`.
- **קוראים** בקומפוננטה (אפליקציה קטנה) או ב-Facade Service (אפליקציה גדולה — שירות שעוטף `select` + `dispatch` כך שהקומפוננטה לא מכירה את NgRx).

### 15.7 דרכים בלי לכתוב סלקטורים ידנית
- **`@ngrx/entity`** — `adapter.getSelectors()` מייצר `selectAll`, `selectTotal` וכו' חינם.
- **`@ngrx/signals` (SignalStore)** — אין סלקטורים נפרדים בכלל; המצב הוא signals וערכים נגזרים הם `computed`.
- **`@ngrx/data`** — מייצר את הכל אוטומטית לישות.

### 15.8 למה בכלל סלקטור ולא לקרוא ישירות מהסטור
1. **memoization** — לא מחשבים מחדש סתם.
2. **בידוד מצורת המצב** — משנים את מבנה הסטור? מתקנים רק את הסלקטור, לא כל קומפוננטה.
3. **בטיחות טיפוסים** — TypeScript יודע מה חוזר.
4. **שימוש חוזר** — אותה שאילתה בכמה מקומות, מוגדרת פעם אחת.

---

*מסמך זה מסכם את הלמידה על NgRx בפרויקט. לעדכון — ערוך את הקבצים בתיקיית `apps/task-manager/src/app/tasks-page/store/`.*
