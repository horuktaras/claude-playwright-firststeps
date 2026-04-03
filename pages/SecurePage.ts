import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SecurePage extends BasePage {
  private readonly logoutButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
    this.flashMessage = page.locator('#flash');
  }

  protected get path(): string {
    return '/secure';
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
