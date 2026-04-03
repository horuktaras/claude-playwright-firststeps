import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators are private — encapsulation (SOLID: tests don't touch raw selectors)
  // Defined as readonly Locator properties, not methods — they're lazy, not evaluated yet
  //
  // Java Selenium equivalent:
  //   @FindBy(id = "username") private WebElement usernameInput;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  readonly flashMessage: Locator; // public — tests need to assert on it

  constructor(page: Page) {
    super(page);
    // Locators are initialized here but NOT resolved yet — Playwright is lazy
    // This is like PageFactory.initElements() in Java, but without reflection magic
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
  }

  protected get path(): string {
    return '/login';
  }

  // Action methods — encapsulate interactions (like WebDriver actions in POM)
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // High-level composite action — most tests will use this
  // In Java: loginPage.loginAs("user", "pass")
  async loginAs(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}
