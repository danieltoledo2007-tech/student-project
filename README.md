# Student Project

An [Nx](https://nx.dev) monorepo containing two Angular front-ends and a single
NestJS back-end. Both front-ends share the same interfaces and a reusable
"generic form" component, so a form is described as **data** (a list of fields)
and rendered by one shared component instead of being hand-written each time.

## What's inside

```
student-project/
├── apps/
│   ├── student-app/      Angular app — register students & list them
│   ├── task-manager/     Angular app — create / delete / toggle tasks
│   └── student-api/      NestJS API — /api/students and /api/tasks
└── libs/
    ├── shared-interfaces/  Task & FormField models (used by front + back)
    └── ui-forms/           GenericFormComponent + form field definitions
```

### Apps

- **student-app** — a student registration page. It renders the shared generic
  form from `STUDENT_FORM_FIELDS` (name, age, grade), submits new students to
  `POST /api/students`, and lists everyone already registered via
  `GET /api/students`.
- **task-manager** — a task list. It loads tasks from `GET /api/tasks` and lets
  you add (modal with the generic form), delete, and toggle each task's
  `completed` state. State is held with Angular **signals**; UI logic lives in
  the smart `TasksPage`, while `TasksList`, `TaskItem`, and `TaskForm` are
  presentational (`@Input` down, `@Output` up).
- **student-api** — a NestJS server (global prefix `/api`, port `3000`):
  - `AppController` → `GET/POST /api/students`, stored in `students.json`
  - `TasksController` (+ `TasksService`, `CreateTaskDto`) →
    `GET/POST/DELETE/PATCH /api/tasks`, stored in `tasks.json`

### Libraries

- **shared-interfaces** — `Task` and `FormField` TypeScript interfaces, imported
  as `@student-project/shared-interfaces` by both the apps and the API so the
  whole workspace agrees on the same data shapes.
- **ui-forms** — `GenericFormComponent` (`<app-generic-form>`) that builds a
  reactive `FormGroup` from a `FormField[]` description via `buildFormGroup`,
  plus `STUDENT_FORM_FIELDS` and `TASK_FORM_FIELDS`. Exported as
  `@student-project/ui-forms`.

## How it fits together

```
Angular app  →  <app-generic-form> (ui-forms)   ← form built from FormField[]
     │
     └─ HttpClient  →  /api/...  →  NestJS controller  →  reads/writes *.json
```

Each Angular app has a `proxy.conf.json` that forwards `/api` to
`http://localhost:3000`, so the front-ends call `/api/...` directly in
development without CORS issues.

## Getting started

```sh
npm install
```

Run the back-end first (or let Nx start it via the front-end's `dependsOn`):

```sh
npx nx serve student-api      # NestJS on http://localhost:3000/api
```

Run a front-end:

```sh
npx nx serve student-app      # student registration app
npx nx serve task-manager     # task manager app
```

Other useful targets:

```sh
npx nx build <project>        # production build
npx nx test <project>         # unit tests
npx nx lint <project>         # lint
npx nx graph                  # visualize the project graph
```

## Tech stack

Angular 21 (module-based, zoneless, reactive forms + signals) ·
NestJS 11 (with `class-validator`) · Nx 23 monorepo · TypeScript 5.9 ·
JSON-file persistence.
