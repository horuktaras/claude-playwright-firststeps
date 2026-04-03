import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragAndDropPage extends BasePage {
  // The page has two columns side by side, each with a header label ("A" or "B")
  // After dragging column A onto column B, they swap — headers change positions
  private readonly columnA: Locator;
  private readonly columnB: Locator;

  constructor(page: Page) {
    super(page);
    this.columnA = page.locator('#column-a');
    this.columnB = page.locator('#column-b');
  }

  protected get path(): string {
    return '/drag_and_drop';
  }

  // Playwright's dragTo() dispatches the full sequence of mouse events:
  // mousedown → mousemove → dragstart → drag → dragenter → dragover → drop → dragend
  // Java Selenium equivalent: Actions builder = new Actions(driver);
  //   builder.dragAndDrop(source, target).perform();
  async dragColumnAtoB(): Promise<void> {
    await this.columnA.dragTo(this.columnB);
  }

  async dragColumnBtoA(): Promise<void> {
    await this.columnB.dragTo(this.columnA);
  }

  async getColumnALabel(): Promise<string> {
    return this.columnA.locator('header').innerText();
  }

  async getColumnBLabel(): Promise<string> {
    return this.columnB.locator('header').innerText();
  }
}
