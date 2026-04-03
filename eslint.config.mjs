// ESLint flat config (ESLint 9+) — the modern format
// Java analogy: checkstyle.xml — defines rules the linter enforces

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Base JS rules (like enabling Checkstyle's basic ruleset)
  js.configs.recommended,

  // TypeScript-aware rules on top
  ...tseslint.configs.recommended,

  // Disables all ESLint rules that conflict with Prettier formatting
  // Must be last so it can override previous configs
  prettierConfig,

  {
    // Apply TypeScript rules only to .ts files, not to .mjs config files
    files: ['**/*.ts'],
    rules: {
      // Unused variables are almost always bugs — error, not warning
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // _param convention = intentionally unused
          varsIgnorePattern: '^_',
        },
      ],

      // 'any' defeats TypeScript — warn but don't block (tests sometimes need it)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Missing await on async calls is the #1 Playwright bug source
      'no-async-promise-executor': 'error',
    },
  },

  {
    // Don't lint generated/compiled output
    ignores: ['node_modules/', 'dist/', 'playwright-report/', 'test-results/'],
  }
);
