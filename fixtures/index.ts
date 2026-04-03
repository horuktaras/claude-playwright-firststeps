// Single import point for all fixtures
// Tests import from here instead of from individual fixture files
// Java analogy: a single @ExtendWith that pulls in all your extensions

import { mergeTests } from '@playwright/test';
import { test as pagesTest, expect as pagesExpect } from './pages.fixture';
import { test as authTest } from './auth.fixture';

// Merge all fixture sets into one — combined type is inferred automatically
export const test = mergeTests(pagesTest, authTest);
export const expect = pagesExpect;
