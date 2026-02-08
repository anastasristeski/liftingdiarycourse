# Data Fetching Standards

## Server Components Only

**ALL** data fetching **must** be done in React Server Components. This is the single allowed method for retrieving data in this application.

**Do not** fetch data via:

- Route Handlers (`app/api/` routes)
- Client Components (`"use client"` files)
- `useEffect`, `fetch` calls on the client, or any client-side data fetching libraries (e.g. SWR, React Query)
- Server Actions used for reading data (Server Actions are for mutations only)

If a Client Component needs data, pass it down as props from a parent Server Component.

## Database Queries via `/data` Helper Functions

All database queries **must** be performed through helper functions located in the `src/data/` directory.

- Each domain entity should have its own file (e.g. `src/data/workouts.ts`, `src/data/exercises.ts`).
- These helper functions are the **only** place where database access occurs. Components must never import the database client directly.
- Helper functions must be called exclusively from Server Components.

## Drizzle ORM Only — No Raw SQL

All queries **must** use [Drizzle ORM](https://orm.drizzle.team/). **Do not** write raw SQL strings, use `sql` tagged templates for full queries, or bypass Drizzle's query builder in any way.

```ts
// CORRECT — Drizzle query builder
const workouts = await db
  .select()
  .from(workoutsTable)
  .where(eq(workoutsTable.userId, userId));

// WRONG — raw SQL
const workouts = await db.execute("SELECT * FROM workouts WHERE user_id = ?", [userId]);
```

## User Data Isolation

**A logged-in user must ONLY be able to access their own data.** This is a critical security requirement.

Every data-fetching helper function **must** filter by the authenticated user's ID. No function should ever return data belonging to another user.

```ts
// CORRECT — always scoped to the current user
export async function getWorkouts(userId: string) {
  return db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.userId, userId));
}

// WRONG — no user filter, exposes all users' data
export async function getWorkouts() {
  return db.select().from(workoutsTable);
}
```

- The authenticated user's ID must be retrieved from the session/auth layer at the Server Component level and passed into every data helper.
- **Never** trust a user-supplied ID from query params or request bodies to determine data ownership — always use the server-side session.
- There are **no exceptions** to this rule. Every query that touches user-owned data must include a `userId` filter.
