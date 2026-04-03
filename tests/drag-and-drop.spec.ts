import { expect, test } from '../fixtures/pages.fixture';

test.describe('Drag and Drop page', { tag: '@drag-and-drop' }, () => {
  test(
    'should display correct initial column labels',
    { tag: '@smoke' },
    async ({ dragAndDropPage }) => {
      await dragAndDropPage.navigate();

      expect(await dragAndDropPage.getColumnALabel()).toBe('A');
      expect(await dragAndDropPage.getColumnBLabel()).toBe('B');
    }
  );

  test(
    'should swap columns when dragging A onto B',
    { tag: '@smoke' },
    async ({ dragAndDropPage }) => {
      await dragAndDropPage.navigate();
      await dragAndDropPage.dragColumnAtoB();

      // After drag: the left column now holds "B", right column holds "A"
      expect(await dragAndDropPage.getColumnALabel()).toBe('B');
      expect(await dragAndDropPage.getColumnBLabel()).toBe('A');
    }
  );

  test(
    'should swap columns when dragging B onto A',
    { tag: '@regression' },
    async ({ dragAndDropPage }) => {
      await dragAndDropPage.navigate();
      await dragAndDropPage.dragColumnBtoA();

      expect(await dragAndDropPage.getColumnALabel()).toBe('B');
      expect(await dragAndDropPage.getColumnBLabel()).toBe('A');
    }
  );

  test(
    'should restore original order after dragging back',
    { tag: '@regression' },
    async ({ dragAndDropPage }) => {
      await dragAndDropPage.navigate();

      await dragAndDropPage.dragColumnAtoB();
      expect(await dragAndDropPage.getColumnALabel()).toBe('B');

      // Drag back — should return to original state
      await dragAndDropPage.dragColumnAtoB();
      expect(await dragAndDropPage.getColumnALabel()).toBe('A');
      expect(await dragAndDropPage.getColumnBLabel()).toBe('B');
    }
  );
});
