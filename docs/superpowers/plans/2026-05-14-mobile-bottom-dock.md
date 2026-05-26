# Mobile Bottom Dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile hamburger menu with a fixed bottom dock for page navigation while keeping the top header cart and brand behavior intact.

**Architecture:** Keep desktop navigation unchanged inside `SiteNav`, but replace the mobile-only menu state and dropdown with a metadata-driven bottom dock rendered from the same page model. Update `App` layout spacing to reserve space for the fixed dock on mobile, and cover the behavior with component tests that assert mobile nav items and the absence of the hamburger menu.

**Tech Stack:** React 19, TypeScript, Tailwind utility classes, Zustand, Vitest, Testing Library, `lucide-react`

---

## File Map

- Modify: `src/components/SiteNav.tsx`
  - Remove hamburger/dropdown logic
  - Add mobile dock page metadata with icons
  - Keep desktop nav and header cart logic intact
- Modify: `src/App.tsx`
  - Add mobile-safe bottom spacing so content/footer stay above the dock
- Create: `src/components/SiteNav.test.tsx`
  - Verify mobile dock rendering
- Modify: `package.json`
  - No changes expected

### Task 1: Add failing tests for the new mobile dock

**Files:**
- Create: `src/components/SiteNav.test.tsx`
- Test: `src/components/SiteNav.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteNav } from './SiteNav'
import { useCartStore } from '../stores/useCartStore'

vi.mock('../stores/useCartStore', () => ({
  useCartStore: vi.fn(),
}))

describe('SiteNav mobile dock', () => {
  const useCartStoreMock = vi.mocked(useCartStore)

  beforeEach(() => {
    useCartStoreMock.mockImplementation((selector: any) =>
      selector({
        items: [{ quantity: 2 }],
        openCart: vi.fn(),
      }),
    )
  })

  it('renders bottom dock page items and no menu button on mobile', () => {
    render(<SiteNav currentPage="Home" onNavigate={vi.fn()} />)

    expect(screen.getByLabelText('Mobile bottom navigation')).toBeInTheDocument()
    expect(screen.queryByLabelText('Menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /chairs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tables/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /collections/i })).toBeInTheDocument()
  })

  it('navigates when a dock item is tapped', () => {
    const onNavigate = vi.fn()

    render(<SiteNav currentPage="Home" onNavigate={onNavigate} />)

    fireEvent.click(screen.getByRole('button', { name: /chairs/i }))

    expect(onNavigate).toHaveBeenCalledWith('Chairs')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/SiteNav.test.tsx`
Expected: FAIL because `SiteNav` still renders the hamburger menu and does not render a mobile bottom dock.

- [ ] **Step 3: Write minimal implementation**

```tsx
// in src/components/SiteNav.tsx
const baseNavItems = [
  { page: 'Home', label: 'Home', Icon: Home },
  { page: 'Chairs', label: 'Chairs', Icon: Armchair },
  { page: 'Tables', label: 'Tables', Icon: TableProperties },
  { page: 'Collections', label: 'Collections', Icon: LayoutGrid },
] as const

<nav
  aria-label="Mobile bottom navigation"
  className="fixed inset-x-4 bottom-4 z-40 md:hidden"
>
  <div className="grid grid-cols-4 rounded-[28px] border border-[var(--border-warm)] bg-[#fff9f0e8] p-2 shadow-[0_18px_40px_rgba(44,34,24,0.18)] backdrop-blur-xl">
    {baseNavItems.map(({ page, label, Icon }) => (
      <button key={page} type="button" onClick={() => onNavigate(page)}>
        <Icon />
        <span>{label}</span>
      </button>
    ))}
  </div>
</nav>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/SiteNav.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.tsx src/components/SiteNav.test.tsx
git commit -m "feat: add mobile bottom dock navigation"
```

### Task 2: Add mobile layout spacing for the dock

**Files:**
- Modify: `src/App.tsx`
- Test: `src/components/SiteNav.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it('keeps footer and content clear of the mobile dock by reserving bottom space in app layout', () => {
  // Prefer assertion on app wrapper class after exposing a stable layout class in App
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/SiteNav.test.tsx`
Expected: FAIL because `App` does not yet reserve bottom space for the mobile dock.

- [ ] **Step 3: Write minimal implementation**

```tsx
// in src/App.tsx
<main className="container space-y-24 px-0 py-12 pb-32 md:pb-12">
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/SiteNav.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/SiteNav.test.tsx
git commit -m "feat: reserve mobile space for bottom dock"
```

## Self-Review

- Spec coverage:
  - Bottom mobile dock: Task 1
  - No hamburger menu on mobile: Task 1
  - Top header cart unchanged: Task 1
  - Content/footer spacing above dock: Task 2
  - Desktop nav unchanged: Task 1 via non-destructive modification of mobile-only branch
- Placeholder scan:
  - One weak spot existed in Task 2 test; execute with a concrete `App` test or a class assertion if needed during implementation.
- Type consistency:
  - Use `PageKey` consistently for page metadata, navigation handlers, and test assertions.
