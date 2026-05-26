# Loading Joinery Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current spinner and `Loading Sanctuary...` text with a captionless animated dining-table assembly loader.

**Architecture:** Add a dedicated `LoadingJoineryTable` component that renders a lightweight CSS-driven dining-table assembly animation, then swap it into the existing `App` loading gate. Keep the data-loading behavior unchanged and verify both the loading and loaded states through `App` tests.

**Tech Stack:** React 19, TypeScript, Tailwind utility classes, inline CSS animation, Vitest, Testing Library

---

## File Map

- Create: `src/components/LoadingJoineryTable.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

### Task 1: Cover the loading state with a failing test

**Files:**
- Modify: `src/App.test.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `npm test -- src/App.test.tsx` and confirm it fails because the old spinner/text still render**
- [ ] **Step 3: Implement the loader component and replace the loading block in `src/App.tsx`**
- [ ] **Step 4: Run `npm test -- src/App.test.tsx` and confirm it passes**
- [ ] **Step 5: Commit**

### Task 2: Verify the focused loading/app regression suite

**Files:**
- Test: `src/App.test.tsx`

- [ ] **Step 1: Run `npm test -- src/App.test.tsx src/components/SiteNav.test.tsx src/components/LiveCatalog.test.tsx src/types/catalog.test.ts src/lib/utils.test.ts`**
- [ ] **Step 2: Run `npx eslint src/App.tsx src/App.test.tsx src/components/LoadingJoineryTable.tsx`**
- [ ] **Step 3: Commit**
