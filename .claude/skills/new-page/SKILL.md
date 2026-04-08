---
name: new-page
description: Scaffold a new Page Object, fixture registration, and spec file for this Playwright project
---

The user wants to add a new page to the test framework. They will provide a page name and URL path as arguments: `/new-page <ClassName> <url-path>` (e.g. `/new-page DropdownPage /dropdown`).

Parse $ARGUMENTS as: first word = ClassName (PascalCase), second word = url path (e.g. /dropdown).

Derive from ClassName:

- **fixtureField**: camelCase of ClassName without "Page" suffix (e.g. DropdownPage → dropdownPage)
- **specFileName**: kebab-case of the fixture field (e.g. dropdownPage → dropdown.spec.ts)
- **tag**: `@` + kebab-case (e.g. @dropdown)

## Step 1 — Create the Page Object

Create `pages/<ClassName>.ts` following this exact pattern from the existing codebase:

```typescript
import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class <ClassName> extends BasePage {
  // TODO: add locators here
  // private readonly someElement: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: initialize locators
    // this.someElement = page.locator('selector');
  }

  protected get path(): string {
    return '<url-path>';
  }

  // TODO: add page-specific action and getter methods
}
```

Leave the Locator import even if no locators are defined yet — the user will fill them in.

## Step 2 — Register the fixture

Edit `fixtures/pages.fixture.ts`:

1. Add import at the top with the other page imports:
   `import { <ClassName> } from '../pages/<ClassName>';`

2. Add to the `PageFixtures` type:
   `<fixtureField>: <ClassName>;`

3. Add to the `base.extend<PageFixtures>({...})` object:
   ```typescript
   <fixtureField>: async ({ page }, use) => {
     await use(new <ClassName>(page));
   },
   ```

## Step 3 — Create the spec file

Create `tests/<specFileName>` following this exact pattern:

```typescript
import { expect, test } from '../fixtures/pages.fixture';

test.describe('<ClassName> page', { tag: '<tag>' }, () => {
  test(
    'should load the page',
    { tag: '@smoke' },
    async ({ <fixtureField> }) => {
      await <fixtureField>.navigate();

      // TODO: add assertions
    }
  );
});
```

## Step 4 — Report back

Tell the user exactly which files were created/modified and remind them to:

1. Add locators and methods to the Page Object
2. Add meaningful test cases to the spec file
3. Create a feature branch and PR when ready
