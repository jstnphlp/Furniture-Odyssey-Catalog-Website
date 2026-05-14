// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./components/SiteNav', () => ({
  SiteNav: () => <div>nav</div>,
}))

vi.mock('./components/SiteFooter', () => ({
  SiteFooter: () => <div>footer</div>,
}))

vi.mock('./components/AdminLoginModal', () => ({
  AdminLoginModal: () => null,
}))

vi.mock('./components/CartDrawer', () => ({
  CartDrawer: () => null,
}))

vi.mock('./pages/HomePage', () => ({
  HomePage: () => <div>home page</div>,
}))

vi.mock('./pages/ChairsPage', () => ({
  ChairsPage: () => <div>chairs page</div>,
}))

vi.mock('./pages/TablesPage', () => ({
  TablesPage: () => <div>tables page</div>,
}))

vi.mock('./pages/CollectionsPage', () => ({
  CollectionsPage: () => <div>collections page</div>,
}))

vi.mock('./pages/AdminPage', () => ({
  AdminPage: () => <div>admin page</div>,
}))

const loadContent = vi.fn()

vi.mock('./stores/useAdminStore', () => ({
  useAdminStore: (selector: (state: { isAuthenticated: boolean }) => unknown) =>
    selector({
      isAuthenticated: false,
    }),
}))

vi.mock('./stores/usePageContentStore', () => ({
  usePageContentStore: (
    selector: (state: { loadContent: typeof loadContent; isLoading: boolean }) => unknown,
  ) =>
    selector({
      loadContent,
      isLoading: false,
    }),
}))

describe('App layout', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it('reserves mobile bottom space for the fixed navigation dock', () => {
    const { container } = render(<App />)

    const main = container.querySelector('main')

    expect(main).toBeTruthy()
    expect(main?.className).toContain('pb-32')
    expect(main?.className).toContain('md:pb-12')
    expect(screen.getByText('home page')).toBeTruthy()
  })
})
