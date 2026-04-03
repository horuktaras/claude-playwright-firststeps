import { defineConfig, devices } from '@playwright/test';
import { config } from './config/environments';

export default defineConfig({
  // Directory where tests live
  testDir: './tests',

  // Run all tests in parallel (like TestNG parallel="methods")
  fullyParallel: true,

  // Fail the build if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // Retry on CI only (like @Retry in TestNG)
  retries: process.env.CI ? 2 : 0,

  // Cap at 2 workers locally — the-internet.herokuapp.com is a free Heroku app
  // that rate-limits under high parallel load. In a real project this would be higher.
  workers: process.env.CI ? 1 : 2,

  // Reporters — different outputs for different consumers:
  // - locally: 'list' (terminal) + 'html' (browser report)
  // - on CI: 'github' annotates failed tests directly in the PR diff
  // - 'junit' produces XML that GitHub Actions parses for the test results tab
  reporter: process.env.CI
    ? [
        ['github'],                                        // inline PR annotations
        ['junit', { outputFile: 'test-results/junit.xml' }], // GitHub test results tab
        ['html', { open: 'never' }],                      // downloadable artifact
      ]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    // Base URL comes from typed environment config — no more scattered process.env
    baseURL: config.baseUrl,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    navigationTimeout: config.timeouts.navigation,
    actionTimeout: config.timeouts.action,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
