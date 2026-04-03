import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SecurePage } from '../pages/SecurePage';
import { ApiClient } from '../utils/ApiClient';
import { Users } from '../test-data/users';

type AuthFixtures = {
  apiClient: ApiClient;
  authenticatedPage: SecurePage;
};

export const test = base.extend<AuthFixtures>({
  // apiClient wraps Playwright's standalone 'request' fixture
  // Use this for API-only calls (health checks, data setup, response validation)
  // NOTE: this request context does NOT share sessions with the browser
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  // UI login — reliable for apps that fingerprint sessions (like this one).
  // The-internet.herokuapp.com stores HTTP_USER_AGENT + HTTP_ACCEPT_LANGUAGE hashes
  // in the session. API requests have different headers than the browser,
  // so cookie injection doesn't work here.
  //
  // For apps with a proper token-based API (JWT, OAuth), use apiClient.loginViaApi()
  // and inject the token as an Authorization header instead.
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginAs(Users.valid.username, Users.valid.password);
    await use(new SecurePage(page));
  },
});

export { expect } from '@playwright/test';
