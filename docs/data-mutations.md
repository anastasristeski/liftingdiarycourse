# Data Mutation Standards

## Server Actions Only

**ALL** data mutations **must** be performed via [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations). This is the single allowed method for writing, updating, or deleting data in this application.

**Do not** mutate data via:

- Route Handlers (`app/api/` routes)
- Client-side `fetch` calls
- Direct database calls from components or other files outside `src/data/`

## Colocated `actions.ts` Files

All Server Actions **must** live in dedicated files named `actions.ts`, colocated with the route that uses them.

```
src/app/dashboard/
  page.tsx
  actions.ts       <-- Server Actions for the dashboard route

src/app/workouts/[id]/
  page.tsx
  actions.ts       <-- Server Actions for the workout detail route
```

- Every `actions.ts` file **must** start with the `"use server"` directive at the top of the file.
- **Do not** define Server Actions inline inside Server Components or Client Components.
- **Do not** place Server Actions in shared utility files or the `src/data/` directory.

## Typed Parameters — No `FormData`

All Server Action parameters **must** be explicitly typed with TypeScript. The `FormData` type is **not allowed** as a parameter type.

```ts
// CORRECT — explicitly typed parameters
export async function createWorkout(name: string, date: Date) {
  // ...
}

// WRONG — FormData parameter
export async function createWorkout(formData: FormData) {
  // ...
}
```

If a form needs to call a Server Action, bind the typed arguments before passing the action, or extract and type the values before calling the action.

## Zod Validation

**ALL** Server Actions **must** validate their arguments using [Zod](https://zod.dev/) before performing any database operation.

- Define a Zod schema for the action's parameters at the top of the `actions.ts` file or inline within the action.
- Parse the arguments using `z.parse()` or `z.safeParse()` at the start of every action.
- **Never** trust incoming arguments without validation, even though they are typed.

```ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });

  await createWorkout(validated.name, validated.date);
}
```

## Database Mutations via `src/data/` Helper Functions

All database writes **must** go through helper functions in the `src/data/` directory — the same pattern used for data fetching. Server Actions must **never** import the database client directly.

- Each domain entity should have its mutations alongside its queries (e.g. `src/data/workouts.ts` contains both `getWorkouts` and `createWorkout`).
- Helper functions are the **only** place where Drizzle ORM calls occur.
- All mutations **must** use [Drizzle ORM](https://orm.drizzle.team/). **Do not** write raw SQL.

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workoutsTable } from "@/db/schema";

export async function createWorkout(name: string, date: Date, userId: string) {
  await db.insert(workoutsTable).values({ name, date, userId });
}
```

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });

  // get userId from session/auth layer
  await createWorkout(validated.name, validated.date, userId);
}
```

## User Data Isolation

The same rule from data fetching applies to mutations: **a user must only be able to mutate their own data.**

- The authenticated user's ID must come from the server-side session — **never** from client-supplied arguments.
- Every mutation helper that touches user-owned data must require and filter by `userId`.
- For updates and deletes, always include a `userId` condition in the `where` clause to prevent users from modifying another user's records.

```ts
// CORRECT — scoped to the current user
export async function deleteWorkout(workoutId: string, userId: string) {
  await db
    .delete(workoutsTable)
    .where(
      and(eq(workoutsTable.id, workoutId), eq(workoutsTable.userId, userId))
    );
}

// WRONG — no user filter, any user could delete any workout
export async function deleteWorkout(workoutId: string) {
  await db.delete(workoutsTable).where(eq(workoutsTable.id, workoutId));
}
```
