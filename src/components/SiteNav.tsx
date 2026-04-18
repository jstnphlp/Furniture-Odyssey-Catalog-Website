import { useRef, useCallback } from 'react'
import { useAdminStore } from '../stores/useAdminStore'

type PageKey = 'Home' | 'Chairs' | 'Tables' | 'Collections' | 'Admin'

const navItems: Exclude<PageKey, 'Admin'>[] = ['Home', 'Chairs', 'Tables', 'Collections']

interface SiteNavProps {
  currentPage: PageKey
  onNavigate: (page: PageKey) => void
  brandName?: string
}

export function SiteNav({
  currentPage,
  onNavigate,
  brandName = 'Furniture Odyssey',
}: SiteNavProps) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const openLogin = useAdminStore((s) => s.openLogin)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePointerDown = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (isAuthenticated) {
        onNavigate('Admin')
      } else {
        openLogin()
      }
    }, 5000)
  }, [isAuthenticated, onNavigate, openLogin])

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleLogoClick = useCallback(() => {
    onNavigate('Home')
  }, [onNavigate])

  return (
    <header
      className="sticky top-0 z-30 border-b border-[var(--border-warm)] bg-[#fff9f0f2] backdrop-blur-md"
      id="site-nav"
    >
      <div className="container flex items-center justify-between py-4">
        {/* Brand — long-press 5s to trigger admin */}
        <button
          type="button"
          onClick={handleLogoClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="group flex select-none items-center gap-2.5 transition-opacity hover:opacity-75"
        >
          <img
            src="/fologo7.svg"
            alt="Furniture Odyssey Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-[17px] font-semibold text-[var(--text-dark)]">
            Furniture <span className="text-[#b97f50]">Odyssey</span>
          </span>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map((item) => {
            const isActive = currentPage === item
            return (
              <button
                type="button"
                key={item}
                onClick={() => onNavigate(item)}
                className={`text-[13px] font-semibold tracking-wide transition ${isActive
                  ? 'text-[#b97f50] underline decoration-[#b97f50] decoration-2 underline-offset-[10px]'
                  : 'text-[var(--text-mid)] hover:text-[#b97f50]'
                  }`}
              >
                {item}
              </button>
            )
          })}
          {/* Show Admin link when authenticated */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => onNavigate('Admin')}
              className={`text-[13px] font-semibold tracking-wide transition ${currentPage === 'Admin'
                ? 'text-[#b97f50] underline decoration-[#b97f50] decoration-2 underline-offset-[10px]'
                : 'text-[#b97f50] opacity-60 hover:opacity-100'
                }`}
            >
              🔐 Admin
            </button>
          )}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button type="button" className="icon-button" aria-label="Cart">
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 5h2l2.3 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
              <circle cx="10" cy="19" r="1.2" />
              <circle cx="17" cy="19" r="1.2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export type { PageKey }
