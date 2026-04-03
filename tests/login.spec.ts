import { test, expect } from '../fixtures/pages.fixture';
import { Users } from '../test-data/users';

// Tags can be applied at describe level — all tests in the block inherit them
// Like @Test(groups={"login"}) on every method vs one annotation on the class
test.describe('Login page', { tag: '@login' }, () => {
  // Smoke = critical happy-path tests, run on every deploy (like @Test(groups={"smoke"}))
  test('should display login form', { tag: '@smoke' }, async ({ loginPage, page }) => {
    await loginPage.navigate();
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
  });

  test('should login with valid credentials', { tag: '@smoke' }, async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.loginAs(Users.valid.username, Users.valid.password);

    await expect(page).toHaveURL('/secure');
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  });

  // Regression = full suite, run less frequently (like @Test(groups={"regression"}))
  test(
    'should show error on invalid credentials',
    { tag: '@regression' },
    async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginAs(Users.invalid.username, Users.invalid.password);
      await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
    }
  );

  test('should show error on empty credentials', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.loginAs(Users.emptyCredentials.username, Users.emptyCredentials.password);
    await expect(loginPage.flashMessage).toContainText('Your username is invalid!');
  });

  test('should logout successfully', { tag: '@smoke' }, async ({ loginPage, securePage, page }) => {
    await loginPage.navigate();
    await loginPage.loginAs(Users.valid.username, Users.valid.password);
    await securePage.logout();

    await expect(securePage.flashMessage).toContainText('You logged out of the secure area!');
    await expect(page).toHaveURL('/login');
  });
});
