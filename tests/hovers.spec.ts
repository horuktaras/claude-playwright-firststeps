import { expect, test } from '../fixtures/pages.fixture';

test.describe('Hovers page', { tag: '@hovers' }, () => {
  test('should display three avatar figures', { tag: '@smoke' }, async ({ hoversPage }) => {
    await hoversPage.navigate();

    expect(await hoversPage.getFigureCount()).toBe(3);
  });

  test(
    'should reveal caption with username on hover',
    { tag: '@smoke' },
    async ({ hoversPage }) => {
      await hoversPage.navigate();

      await hoversPage.hoverFigure(0);

      expect(await hoversPage.isCaptionVisible(0)).toBe(true);
      expect(await hoversPage.getCaptionName(0)).toBe('name: user1');
    }
  );

  test(
    'should show correct username for each figure',
    { tag: '@regression' },
    async ({ hoversPage }) => {
      await hoversPage.navigate();

      for (let i = 0; i < 3; i++) {
        await hoversPage.hoverFigure(i);
        expect(await hoversPage.getCaptionName(i)).toBe(`name: user${i + 1}`);
      }
    }
  );

  test(
    'should link to the correct user profile',
    { tag: '@regression' },
    async ({ hoversPage }) => {
      await hoversPage.navigate();

      await hoversPage.hoverFigure(1);

      expect(await hoversPage.getProfileLink(1)).toBe('/users/2');
    }
  );
});
