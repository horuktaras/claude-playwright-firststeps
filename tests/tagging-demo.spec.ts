import { test, expect } from '../fixtures/pages.fixture';

// This file demonstrates test state annotations
// Java analogues shown in each comment

test.describe('Tagging and state demo', () => {
  // test.skip = @Disabled in JUnit 5 / enabled=false in TestNG
  // Use when: feature not yet implemented, env not available, blocked by bug
  test.skip('should demonstrate skip', async ({ loginPage }) => {
    // This test never runs — shown as "skipped" in report
    await loginPage.navigate();
  });

  // test.fixme = known broken test — stronger than skip
  // Signals: "this test reveals a bug, fix in progress"
  // Java has no direct equivalent — closest is @Ignore with a bug ticket comment
  test.fixme('should demonstrate fixme', async ({ loginPage }) => {
    // Runs but expected to fail — marked as fixme in report, not as failure
    await loginPage.navigate();
  });

  // test.slow = triples the timeout for this specific test
  // Useful for tests hitting slow APIs or doing heavy setup
  // Java: @Test(timeOut = 90000) in TestNG
  test.slow('should demonstrate slow test timeout', async ({ loginPage }) => {
    await loginPage.navigate();
    // Default timeout is now tripled: 15s action * 3 = 45s for this test
    await expect(loginPage.flashMessage).toBeHidden();
  });

  // Conditional skip — skip based on runtime condition
  // Like @Assumptions.assumeTrue() in JUnit 5
  test('should skip on CI', async ({ loginPage, page }) => {
    test.skip(!!process.env.CI, 'Skipped in CI — requires local browser setup');

    await loginPage.navigate();
    await expect(page).toHaveURL('/login');
  });
});
