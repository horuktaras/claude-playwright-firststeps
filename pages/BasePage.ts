import { Page, Locator } from '@playwright/test';

// Abstract base — like AbstractPage in Java Selenium
// Cannot be instantiated directly, only extended
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Every page knows its own URL path — Single Responsibility
  protected abstract get path(): string;

  // Navigate to this page (like PageFactory.initElements + driver.get())
  async navigate(): Promise<void> {
    await this.page.goto(this.path);
  }

  // Reusable wait utility — all pages can use this
  // In Selenium you'd have: wait.until(ExpectedConditions.visibilityOf(element))
  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  // Page title — useful for assertions in tests
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
