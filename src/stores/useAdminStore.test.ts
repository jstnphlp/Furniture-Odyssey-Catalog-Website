import { describe, it, expect, beforeEach } from 'vitest'
import { useAdminStore } from './useAdminStore'

describe('useAdminStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAdminStore.setState({
      isAuthenticated: false,
      adminEmail: null,
      showLoginModal: false,
      loginError: null,
    })
  })

  it('openLogin sets showLoginModal to true', () => {
    useAdminStore.getState().openLogin()
    expect(useAdminStore.getState().showLoginModal).toBe(true)
  })

  it('closeLogin sets showLoginModal to false', () => {
    useAdminStore.getState().openLogin() // Open it first
    useAdminStore.getState().closeLogin()
    expect(useAdminStore.getState().showLoginModal).toBe(false)
  })

  it('authenticate rejects unauthorized emails', () => {
    const success = useAdminStore.getState().authenticate('invalid@example.com')
    const state = useAdminStore.getState()
    
    expect(success).toBe(false)
    expect(state.isAuthenticated).toBe(false)
    expect(state.adminEmail).toBe(null)
    expect(state.loginError).toContain('Access denied')
  })

  it('logout resets the auth state', () => {
    // Mock authenticated state
    useAdminStore.setState({
      isAuthenticated: true,
      adminEmail: 'admin@example.com'
    })
    
    useAdminStore.getState().logout()
    
    const state = useAdminStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.adminEmail).toBe(null)
  })

  it('clearError removes loginError', () => {
    useAdminStore.setState({ loginError: 'Some error' })
    useAdminStore.getState().clearError()
    expect(useAdminStore.getState().loginError).toBe(null)
  })
})
