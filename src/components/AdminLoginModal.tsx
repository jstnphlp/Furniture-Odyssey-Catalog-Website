import { useEffect, useRef, useCallback } from 'react'
import { useAdminStore } from '../stores/useAdminStore'

/* ── Extend Window for Google Identity Services ── */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void
          cancel: () => void
        }
      }
    }
  }
}

/* ── Minimal JWT payload decoder (no library needed) ── */
function decodeJwtPayload(token: string): Record<string, string> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return {}
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function AdminLoginModal() {
  const show = useAdminStore((s) => s.showLoginModal)
  const loginError = useAdminStore((s) => s.loginError)
  const closeLogin = useAdminStore((s) => s.closeLogin)
  const authenticate = useAdminStore((s) => s.authenticate)
  const clearError = useAdminStore((s) => s.clearError)

  const btnRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const handleCredential = useCallback(
    (response: { credential: string }) => {
      const payload = decodeJwtPayload(response.credential)
      const email = payload.email ?? ''
      authenticate(email)
    },
    [authenticate],
  )

  useEffect(() => {
    if (!show || !CLIENT_ID || !btnRef.current) return

    const interval = setInterval(() => {
      if (window.google?.accounts?.id && btnRef.current) {
        clearInterval(interval)
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredential,
        })
        window.google.accounts.id.renderButton(btnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'signin_with',
        })
      }
    }, 200)

    return () => clearInterval(interval)
  }, [show, handleCredential])

  if (!show) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(44, 34, 24, 0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => {
        if (e.target === backdropRef.current) closeLogin()
      }}
    >
      <div
        className="animate-fade-in-up relative w-full max-w-md rounded-2xl border border-[var(--border-card)] p-8"
        style={{
          background: 'rgba(255, 249, 240, 0.92)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 64px rgba(44, 34, 24, 0.2)',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={closeLogin}
          className="absolute right-4 top-4 text-[var(--text-mid)] transition-colors hover:text-[var(--text-dark)]"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary)]" style={{ opacity: 0.9 }}>
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <h2 className="font-display text-[24px] text-[var(--text-dark)]">
            Admin Portal
          </h2>
          <p className="mt-2 text-[13px] text-[var(--text-mid)]">
            Authenticate with your authorized Google account to access the admin dashboard.
          </p>
        </div>

        {/* Google Sign-In button */}
        {CLIENT_ID ? (
          <div className="flex justify-center">
            <div ref={btnRef} />
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="text-[13px] font-semibold text-amber-800">
              OAuth Not Configured
            </p>
            <p className="mt-1 text-[12px] text-amber-700">
              Set <code className="rounded bg-amber-100 px-1">VITE_GOOGLE_CLIENT_ID</code> in your <code className="rounded bg-amber-100 px-1">.env</code> file.
            </p>
          </div>
        )}

        {/* Error message */}
        {loginError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-[13px] text-red-700">{loginError}</p>
            <button
              type="button"
              onClick={clearError}
              className="mt-2 text-[12px] font-semibold text-red-600 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Divider + dev bypass (no OAuth configured) */}
        {!CLIENT_ID && (
          <>
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-[var(--border-warm)]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-mid)]">
                Dev Mode
              </span>
              <span className="h-px flex-1 bg-[var(--border-warm)]" />
            </div>
            <button
              type="button"
              className="primary-btn w-full"
              onClick={() => authenticate(import.meta.env.VITE_ADMIN_EMAIL ?? 'dev@localhost')}
            >
              Bypass (Dev Only)
            </button>
          </>
        )}

        <p className="mt-5 text-center text-[11px] text-[var(--text-mid)]">
          🔐 Access is restricted to whitelisted accounts only.
        </p>
      </div>
    </div>
  )
}
