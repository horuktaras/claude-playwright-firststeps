import { expect, test } from '../fixtures/pages.fixture';

test.describe('Checkboxes page', { tag: '@checkboxes' }, () => {
  test('should have correct default state', { tag: '@smoke' }, async ({ checkboxesPage }) => {
    await checkboxesPage.navigate();

    expect(await checkboxesPage.isCheckboxOneChecked()).toBe(false);
    expect(await checkboxesPage.isCheckboxTwoChecked()).toBe(true);
  });

  test(
    'should toggle checkbox one to checked',
    { tag: '@regression' },
    async ({ checkboxesPage }) => {
      await checkboxesPage.navigate();
      await checkboxesPage.toggleCheckboxOne();

      expect(await checkboxesPage.isCheckboxOneChecked()).toBe(true);
    }
  );
});
