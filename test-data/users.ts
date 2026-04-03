// Test data lives here — never inside page objects or test files
// In Java: src/test/resources/users.json + Jackson/POJO binding

export interface User {
  username: string;
  password: string;
}

// Named user constants — like an enum with properties
// Tests reference users by role, not by raw strings
export const Users = {
  valid: {
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
  } satisfies User,

  // A user with wrong credentials — for negative tests
  invalid: {
    username: 'wronguser',
    password: 'wrongpassword',
  } satisfies User,

  emptyCredentials: {
    username: '',
    password: '',
  } satisfies User,

  // Placeholder for a locked-out user, admin, read-only, etc.
  // locked: { username: 'lockeduser', password: '...' } satisfies User,
} as const;
// 'as const' = all values are readonly literals, like Java final fields
// TypeScript will infer 'tomsmith' (literal type) instead of 'string'
