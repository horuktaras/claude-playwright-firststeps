import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SecurePage } from '../pages/SecurePage';
import { CheckboxesPage } from '../pages/CheckboxesPage';

// Define the shape of our custom fixtures
// This is like declaring an interface for what gets injected
type PageFixtures = {
  loginPage: LoginPage;
  securePage: SecurePage;
  checkboxesPage: CheckboxesPage;
};

// base.extend<T>() = extend Playwright's built-in fixtures with ours
// In Java terms: this is your DI container (like Spring @Bean definitions)
export const test = base.extend<PageFixtures>({
  // Each fixture is a function: async ({ dependencies }, use) => { ... }
  // { page } is destructured from Playwright's built-in fixtures
  // 'use' is the yield point — the test runs when use() is called

  loginPage: async ({ page }, use) => {
    // SETUP: create the page object (runs before the test)
    const loginPage = new LoginPage(page);
    await use(loginPage); // ← test runs here, receives loginPage
    // TEARDOWN: anything after use() runs after the test
    // Nothing needed here — Playwright closes the browser automatically
  },

  securePage: async ({ page }, use) => {
    await use(new SecurePage(page));
  },

  checkboxesPage: async ({ page }, use) => {
    await use(new CheckboxesPage(page));
  },
});

// Re-export expect so test files only need one import
// import { test, expect } from '../fixtures/pages.fixture'
export { expect } from '@playwright/test';
