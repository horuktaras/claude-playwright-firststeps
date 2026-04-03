import { expect, test } from '../fixtures/pages.fixture';

test.describe('Iframe page', { tag: '@iframe' }, () => {
  test('should display the correct page heading', { tag: '@smoke' }, async ({ iframePage }) => {
    await iframePage.navigate();

    expect(await iframePage.getHeading()).toBe('An iFrame containing the TinyMCE WYSIWYG Editor');
  });

  test(
    'should load TinyMCE editor with default content',
    { tag: '@smoke' },
    async ({ iframePage }) => {
      await iframePage.navigate();

      // Default placeholder text the app ships with
      expect(await iframePage.getContentText()).toContain('Your content goes here.');
    }
  );

  test(
    'should update editor content via TinyMCE JS API',
    { tag: '@smoke' },
    async ({ iframePage }) => {
      await iframePage.navigate();

      await iframePage.setContent('<p>Hello from Playwright</p>');

      expect(await iframePage.getContentText()).toContain('Hello from Playwright');
    }
  );

  test(
    'should display Bold and Italic toolbar buttons',
    { tag: '@regression' },
    async ({ iframePage }) => {
      await iframePage.navigate();

      expect(await iframePage.isBoldButtonVisible()).toBe(true);
      expect(await iframePage.isItalicButtonVisible()).toBe(true);
    }
  );

  test(
    'should clear editor content via TinyMCE JS API',
    { tag: '@regression' },
    async ({ iframePage }) => {
      await iframePage.navigate();

      await iframePage.setContent('');

      expect(await iframePage.getContentText()).toBe('');
    }
  );
});
