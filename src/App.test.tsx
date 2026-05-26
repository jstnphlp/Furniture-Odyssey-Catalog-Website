// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./components/SiteNav', () => ({
  SiteNav: () => <div>nav</div>,
}))

vi.mock('./components/SiteFooter', () => ({
  SiteFooter: () => <div>footer</div>,
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

const loadContent = vi.fn()
let isLoading = false

vi.mock('./stores/usePageContentStore', () => ({
  usePageContentStore: (
    selector: (state: { loadContent: typeof loadContent; isLoading: boolean }) => unknown,
  ) =>
    selector({
      loadContent,
      isLoading,
    }),
}))

describe('App layout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.scrollTo = vi.fn()
    isLoading = false
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('reserves mobile bottom space for the fixed navigation dock', () => {
    const { container } = render(<App />)

    const main = container.querySelector('main')

    expect(main).toBeTruthy()
    expect(main?.className).toContain('pb-32')
    expect(main?.className).toContain('md:pb-12')
    expect(screen.getByText('home page')).toBeTruthy()
  })

  it('shows the joinery table loader without loading text while app content is loading', () => {
    isLoading = true

    render(<App />)

    expect(screen.getByTestId('loading-joinery-table')).toBeTruthy()
    expect(screen.queryByText('Loading Sanctuary...')).toBeNull()
    expect(screen.queryByText('Loading Sanctuary')).toBeNull()
  })

  it('keeps the joinery loader visible for one final animation cycle after loading completes', () => {
    isLoading = true

    const { rerender } = render(<App />)

    expect(screen.getByTestId('loading-joinery-table')).toBeTruthy()

    isLoading = false
    rerender(<App />)

    expect(screen.getByTestId('loading-joinery-table')).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(screen.getByTestId('loading-joinery-table')).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(2399)
    })

    expect(screen.getByTestId('loading-joinery-table')).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(screen.getByText('home page')).toBeTruthy()
  })
})
