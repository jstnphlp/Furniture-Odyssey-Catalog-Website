# Testing Requirements

Every time you create a new function or modify an existing one, you MUST write a test case to accompany it.

Follow these rules:

1. Always use the project's existing testing framework (e.g., Vitest or Jest) and testing library (e.g., React Testing Library).
2. Place the test file adjacent to the file being tested, matching the same naming convention (e.g., `filename.test.ts` or `filename.spec.tsx`).
3. Ensure the test covers various edge cases, typical inputs, and expected error states.
4. Verify that your tests act as regression protection to confirm the code behaves as expected on any platform.
