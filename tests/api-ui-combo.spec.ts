import { test, expect } from '../fixtures/index';

// This file demonstrates API + UI combination patterns:
// 1. Use API to verify app health before UI tests
// 2. Use API to assert on server responses while UI tests run
// 3. Use page.route() to intercept and mock network traffic

test.describe('API + UI combination', { tag: ['@api', '@regression'] }, () => {
  // Pattern 1: API pre-flight check
  // Verify the app is responding before running slower UI flows
  // Java analogy: @BeforeClass that pings a health endpoint
  test('should verify app is reachable before UI tests', async ({ apiClient, loginPage, page }) => {
    // API: check the login page returns HTTP 200
    const response = await apiClient.get('/login');
    expect(response.status()).toBe(200);

    // UI: navigate and confirm the page renders correctly
    await loginPage.navigate();
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
  });

  // Pattern 2: API response validation + UI verification
  // Assert on the raw HTML/response AND on what the user sees
  test('should match API response content with UI content', async ({
    apiClient,
    loginPage,
    page,
  }) => {
    // API: fetch the page and check raw HTML content
    const response = await apiClient.get('/login');
    const html = await response.text();
    expect(html).toContain('Login Page');
    expect(html).toContain('Username');
    expect(html).toContain('Password');

    // UI: verify the same elements are visible to the user
    await loginPage.navigate();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  // Pattern 3: Network interception with page.route()
  // Intercept a specific request and mock the response
  // Java analogy: WireMock stubbing — stub the HTTP server response
  // This is powerful for: testing error states, slow networks, edge-case responses
  test('should handle login error via mocked response', async ({ page }) => {
    // Intercept ANY POST to /authenticate and force an error response
    await page.route('**/authenticate', async route => {
      // Instead of letting the real request through, fulfill it ourselves
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        // Simulate what the app returns on invalid credentials
        body: `<html><body>
          <div id="flash" class="flash error">Your username is invalid!</div>
          <form action="/login"><input type="text" id="username"><input type="password" id="password">
          <button type="submit">Login</button></form>
        </body></html>`,
      });
    });

    await page.goto('/login');
    await page.getByLabel('Username').fill('anyuser');
    await page.getByLabel('Password').fill('anypassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // The real server never got the request — our mock responded instead
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
  });

  // Intercept GET /checkboxes and return both checkboxes as checked
  // This tests that CheckboxesPage methods work correctly for any server state
  test('should intercept checkboxes page and override both as checked', async ({
    checkboxesPage,
    page,
  }) => {
    // Intercept GET /checkboxes — this is a navigation request, not a POST
    // The pattern '**/checkboxes' matches the full page load request
    await page.route('**/checkboxes', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        // Return minimal HTML with both checkboxes pre-checked
        // Real page has only checkbox 2 checked by default
        body: `<html><body>
          <h3>Checkboxes</h3>
          <form>
            <input type="checkbox" checked=""> checkbox 1
            <br>
            <input type="checkbox" checked=""> checkbox 2
          </form>
        </body></html>`,
      });
    });

    await checkboxesPage.navigate();

    // Both should now be checked — we controlled the server response entirely
    expect(await checkboxesPage.isCheckboxOneChecked()).toBe(true);
    expect(await checkboxesPage.isCheckboxTwoChecked()).toBe(true);
  });

  // Pattern 4: Request inspection — observe what the UI sends to the server
  // Useful for verifying correct request payload without modifying the response
  test('should capture login request payload', async ({ page }) => {
    // Wait for the POST to /authenticate and capture it
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/authenticate') && req.method() === 'POST'
    );

    await page.goto('/login');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    const request = await requestPromise;
    const body = request.postData() ?? '';

    // Verify the form payload contains the right fields
    // Java analogy: ArgumentCaptor in Mockito — capture and inspect what was sent
    expect(body).toContain('username=tomsmith');
    expect(body).toContain('password=SuperSecretPassword');
  });
});
