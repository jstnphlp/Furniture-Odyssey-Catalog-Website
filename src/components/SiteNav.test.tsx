// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteNav } from './SiteNav'
import { useAdminStore } from '../stores/useAdminStore'
import { useCartStore } from '../stores/useCartStore'

describe('SiteNav mobile dock', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    useAdminStore.setState({
      isAuthenticated: false,
      adminEmail: null,
      showLoginModal: false,
      loginError: null,
    })

    useCartStore.setState({
      items: [
        {
          id: 'chair-1',
          name: 'Chair',
          image_url: '/chair.png',
          price: 1000,
          category: 'Chairs',
          quantity: 2,
          cta_label: 'Add to Bag',
        },
      ],
      isOpen: false,
    })
  })

  it('renders bottom dock page items and no menu button on mobile', () => {
    render(<SiteNav currentPage="Home" onNavigate={vi.fn()} />)

    const dock = screen.getByRole('navigation', { name: 'Mobile bottom navigation' })

    expect(dock).toBeTruthy()
    expect(screen.queryByLabelText('Menu')).toBeNull()
    expect(within(dock).getByRole('button', { name: /home/i })).toBeTruthy()
    expect(within(dock).getByRole('button', { name: /chairs/i })).toBeTruthy()
    expect(within(dock).getByRole('button', { name: /tables/i })).toBeTruthy()
    expect(within(dock).getByRole('button', { name: /collections/i })).toBeTruthy()
  })

  it('adds admin to the mobile dock when authenticated', () => {
    useAdminStore.setState({
      isAuthenticated: true,
      adminEmail: 'admin@example.com',
      showLoginModal: false,
      loginError: null,
    })

    render(<SiteNav currentPage="Home" onNavigate={vi.fn()} />)

    const dock = screen.getByRole('navigation', { name: 'Mobile bottom navigation' })

    expect(within(dock).getByRole('button', { name: /admin/i })).toBeTruthy()
  })

  it('navigates when a dock item is tapped', () => {
    const onNavigate = vi.fn()

    render(<SiteNav currentPage="Home" onNavigate={onNavigate} />)

    const dock = screen.getByRole('navigation', { name: 'Mobile bottom navigation' })

    fireEvent.click(within(dock).getByRole('button', { name: /chairs/i }))

    expect(onNavigate).toHaveBeenCalledWith('Chairs')
  })
})
