import { expect, test } from '../fixtures/index';

// Notice: NO login code anywhere in this file
// The 'authenticatedPage' fixture handles it before every test

test.describe('Secure area (authenticated)', { tag: '@secure' }, () => {
  test(
    'should show secure area content',
    { tag: '@smoke' },
    async ({ authenticatedPage: _auth, page }) => {
      // _auth prefix signals: requested to trigger the login fixture, not used directly
      // Playwright fixtures are lazy — they only run when requested by name
      await expect(page).toHaveURL('/secure');
      await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    }
  );

  test('should logout successfully', { tag: '@smoke' }, async ({ authenticatedPage, page }) => {
    await authenticatedPage.logout();

    await expect(page).toHaveURL('/login');
    await expect(authenticatedPage.flashMessage).toContainText(
      'You logged out of the secure area!'
    );
  });
});
