import { FrameLocator, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

type TinyMCEWindow = Window & {
  tinymce?: {
    activeEditor?: {
      initialized: boolean;
      setContent: (c: string) => void;
    };
  };
};

export class IframePage extends BasePage {
  // TinyMCE renders inside an iframe — Playwright's frameLocator() gives us
  // a handle to the iframe's DOM, just like switchTo().frame() in Selenium
  private readonly editorFrame: FrameLocator;
  private readonly editorBody: Locator;
  private readonly boldButton: Locator;
  private readonly italicButton: Locator;
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    // frameLocator() = a scoped context for elements inside the iframe
    this.editorFrame = page.frameLocator('iframe#mce_0_ifr');
    this.editorBody = this.editorFrame.locator('body#tinymce');
    // Toolbar buttons live outside the iframe, in the main page DOM
    this.boldButton = page.locator('button[aria-label="Bold"]');
    this.italicButton = page.locator('button[aria-label="Italic"]');
    this.heading = page.locator('h3');
  }

  protected get path(): string {
    return '/iframe';
  }

  // Override navigate() to wait for TinyMCE to finish initializing.
  // Without this, innerText() reads the body before TinyMCE has loaded
  // the default content — same problem as Selenium needing an explicit wait
  // before switchTo().frame(...).findElement(...).getText().
  async navigate(): Promise<void> {
    await super.navigate();
    await this.page.waitForFunction(
      () => (window as TinyMCEWindow).tinymce?.activeEditor?.initialized === true
    );
  }

  async getHeading(): Promise<string> {
    return this.heading.innerText();
  }

  async getContentText(): Promise<string> {
    // Read directly from the iframe DOM via frameLocator → innerText().
    // Trim because TinyMCE's empty-paragraph state renders as "\n".
    // Java equivalent: driver.switchTo().frame(...); driver.findElement(By.tagName("body")).getText()
    return (await this.editorBody.innerText()).trim();
  }

  async setContent(html: string): Promise<void> {
    // TinyMCE JS API — the only way to write content when the editor is read-only
    // (no commercial license → contenteditable="false" → direct typing blocked)
    await this.page.evaluate(
      (content: string) => (window as TinyMCEWindow).tinymce!.activeEditor!.setContent(content),
      html
    );
  }

  async getEditorAriaLabel(): Promise<string> {
    return this.editorBody.getAttribute('aria-label') as Promise<string>;
  }

  async isBoldButtonVisible(): Promise<boolean> {
    return this.boldButton.isVisible();
  }

  async isItalicButtonVisible(): Promise<boolean> {
    return this.italicButton.isVisible();
  }
}
