# UI Coding Standards

## Component Library

All UI components **must** come from [shadcn/ui](https://ui.shadcn.com/). No custom components should be created. If a UI element is needed, use the corresponding shadcn/ui component or compose existing shadcn/ui components together.

- **Do not** create custom button, input, modal, card, or any other UI components.
- **Do not** install alternative component libraries (e.g. Material UI, Chakra, Radix primitives directly).
- If a shadcn/ui component does not exist for a specific need, compose multiple shadcn/ui components to achieve the desired result.

## Date Formatting

All date formatting **must** use [date-fns](https://date-fns.org/).

Dates should be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Mar 2025
```

To achieve this with date-fns, use the `format` function with ordinal day suffixes:

```ts
import { format } from "date-fns";

// Result: "1st Sep 2025"
format(new Date(2025, 8, 1), "do MMM yyyy");
```

- `do` — day of the month with ordinal suffix (1st, 2nd, 3rd, etc.)
- `MMM` — abbreviated month name (Jan, Feb, Mar, etc.)
- `yyyy` — full year

This format must be used consistently across the entire application wherever dates are displayed to the user.
