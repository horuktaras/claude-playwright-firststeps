---
name: run-smoke
description: Run smoke tests locally and report results clearly
---

The user wants to run the smoke test suite. $ARGUMENTS may contain an optional tag to narrow the run further (e.g. `@drag-and-drop`).

## Step 1 — Run tests

If $ARGUMENTS is empty, run all smoke tests:

```
npm run test:smoke
```

If $ARGUMENTS contains a tag, combine it with @smoke:

```
npx playwright test --grep "$ARGUMENTS"
```

Capture the full output.

## Step 2 — Report results

Parse and summarise the output clearly:

- **Passed**: list count
- **Failed**: list each failing test by name and the error message (one line)
- **Skipped**: count if any
- **Duration**: total run time

If all tests passed — say so clearly and give a thumbs up.

## Step 3 — On failure

If any tests failed:

1. Show the exact error for each failure
2. Identify the likely cause (selector issue, timing, assertion mismatch, etc.)
3. Suggest the next debugging step (e.g. `npm run test:debug`, check the HTML report with `npm run report`)
