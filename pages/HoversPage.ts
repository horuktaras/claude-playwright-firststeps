import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HoversPage extends BasePage {
  // The page shows 3 avatar figures. Hovering each reveals a .figcaption div
  // (note: it's a <div class="figcaption">, NOT a <figcaption> HTML element)
  // with the user's name and a "View profile" link.
  private readonly figures: Locator;

  constructor(page: Page) {
    super(page);
    this.figures = page.locator('.figure');
  }

  protected get path(): string {
    return '/hovers';
  }

  // Hover over a figure by 0-based index (0 = user1, 1 = user2, 2 = user3)
  async hoverFigure(index: number): Promise<void> {
    await this.figures.nth(index).hover();
  }

  // Returns true if the caption for a given figure is currently visible.
  // isVisible() checks CSS display/visibility — the :hover rule toggles display: block/none.
  async isCaptionVisible(index: number): Promise<boolean> {
    return this.figures.nth(index).locator('.figcaption').isVisible();
  }

  // Returns the name text from the caption (e.g. "name: user1").
  // textContent() works on hidden elements — no visibility wait needed.
  async getCaptionName(index: number): Promise<string> {
    return ((await this.figures.nth(index).locator('.figcaption h5').textContent()) ?? '').trim();
  }

  // Returns the href of the "View profile" link inside the caption.
  // getAttribute() works on hidden elements — no visibility wait needed.
  async getProfileLink(index: number): Promise<string | null> {
    return this.figures.nth(index).locator('.figcaption a').getAttribute('href');
  }

  async getFigureCount(): Promise<number> {
    return this.figures.count();
  }
}
