import { BasePage } from '@pages/BasePage';
import { Locator, Page } from '@playwright/test';

export class CheckboxesPage extends BasePage {
  private readonly checkboxOne: Locator;
  private readonly checkboxTwo: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxOne = page.getByRole('checkbox').nth(0); // first
    this.checkboxTwo = page.getByRole('checkbox').nth(1); // second
  }

  async isCheckboxOneChecked(): Promise<boolean> {
    return await this.checkboxOne.isChecked();
  }

  async isCheckboxTwoChecked(): Promise<boolean> {
    return await this.checkboxTwo.isChecked();
  }

  async toggleCheckboxOne(): Promise<void> {
    await this.checkboxOne.click();
  }

  async toggleCheckboxTwo(): Promise<void> {
    await this.checkboxTwo.click();
  }

  protected get path(): string {
    return '/checkboxes';
  }
}
