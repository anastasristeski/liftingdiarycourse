# Auth Coding Standards

## Clerk Only

All authentication **must** use [Clerk](https://clerk.com/) via the `@clerk/nextjs` package. **Do not** use any other auth library or roll custom authentication logic.

- **Do not** install alternative auth libraries (e.g. NextAuth, Auth.js, Lucia, Supabase Auth).
- **Do not** build custom sign-in/sign-up forms — use Clerk's prebuilt components.

## ClerkProvider

The `<ClerkProvider>` **must** wrap the entire application in the root layout (`src/app/layout.tsx`). All Clerk components and hooks depend on this provider being present at the top of the component tree.

## Middleware

Clerk middleware **must** be configured in `src/proxy.ts` using `clerkMiddleware()` from `@clerk/nextjs/server`. This ensures authentication state is available on every request.

## Getting the User ID

In **Server Components**, use the `auth()` helper from `@clerk/nextjs/server` to retrieve the current user's ID:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();

if (!userId) {
  redirect("/");
}
```

- **Always** `await` the `auth()` call — it returns a promise.
- **Always** check for a missing `userId` and redirect unauthenticated users.
- **Never** trust client-supplied user IDs. The server-side `auth()` call is the only source of truth for the current user's identity.

## Clerk UI Components

Use Clerk's prebuilt React components for all auth-related UI:

- `<SignInButton>` / `<SignUpButton>` — render sign-in and sign-up triggers.
- `<SignedIn>` / `<SignedOut>` — conditionally render content based on auth state.
- `<UserButton>` — render the user avatar with account management dropdown.

These components **must** be imported from `@clerk/nextjs`:

```ts
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
```

- **Do not** build custom sign-in/sign-up UI or account management screens.
- Use `mode="modal"` on `<SignInButton>` and `<SignUpButton>` to keep users on the current page.

## Protected Pages

Every page that requires authentication **must** verify the user at the top of the Server Component before rendering or fetching data:

```ts
export default async function ProtectedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Safe to fetch user-scoped data with userId
}
```

- **Do not** rely solely on middleware to protect pages — always check `userId` in the component itself before accessing data.
- Pass the `userId` into data-fetching helpers to scope all queries to the authenticated user (see `docs/data-fetching.md`).

## Environment Variables

Clerk requires the following environment variables to be set:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

These **must** be defined in `.env.local` and **must never** be committed to version control.
