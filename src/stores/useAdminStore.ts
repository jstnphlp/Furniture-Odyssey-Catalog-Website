import { create } from 'zustand'

interface AdminState {
  isAuthenticated: boolean
  adminEmail: string | null
  showLoginModal: boolean
  loginError: string | null
  openLogin: () => void
  closeLogin: () => void
  authenticate: (email: string) => boolean
  logout: () => void
  clearError: () => void
}

const ADMIN_EMAILS = String(import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e: string) => e.trim())
  .filter(Boolean)

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  adminEmail: null,
  showLoginModal: false,
  loginError: null,

  openLogin: () => set({ showLoginModal: true, loginError: null }),
  closeLogin: () => set({ showLoginModal: false, loginError: null }),

  authenticate: (email: string) => {
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      set({
        isAuthenticated: true,
        adminEmail: email,
        showLoginModal: false,
        loginError: null,
      })
      return true
    }
    set({ loginError: `Access denied for ${email}. Not an authorized admin.` })
    return false
  },

  logout: () =>
    set({
      isAuthenticated: false,
      adminEmail: null,
      showLoginModal: false,
      loginError: null,
    }),

  clearError: () => set({ loginError: null }),
}))
