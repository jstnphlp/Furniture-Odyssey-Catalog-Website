import { useRef, useCallback } from 'react'
import type { JSX, SVGProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Armchair, House, LayoutGrid, Shield } from 'lucide-react'
import { useAdminStore } from '../stores/useAdminStore'
import { useCartStore } from '../stores/useCartStore'

type PageKey = 'Home' | 'Chairs' | 'Tables' | 'Collections' | 'Admin'

const navItems: Exclude<PageKey, 'Admin'>[] = ['Home', 'Chairs', 'Tables', 'Collections']

interface SiteNavProps {
  currentPage: PageKey
  onNavigate: (page: PageKey) => void
  brandName?: string
}

interface NavItemDefinition {
  page: PageKey
  label: string
  Icon: LucideIcon | ((props: SVGProps<SVGSVGElement>) => JSX.Element)
}

function DiningTableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="4" y="7" width="16" height="4" rx="1.5" strokeWidth="1.8" />
      <path d="M7 11v6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 11v6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 17h4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 17h4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.75 9.25h1.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.75 9.25h1.5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const baseMobileNavItems: NavItemDefinition[] = [
  { page: 'Home', label: 'Home', Icon: House },
  { page: 'Chairs', label: 'Chairs', Icon: Armchair },
  { page: 'Tables', label: 'Tables', Icon: DiningTableIcon },
  { page: 'Collections', label: 'Collections', Icon: LayoutGrid },
]

export function SiteNav({
  currentPage,
  onNavigate,
  brandName = 'Furniture Odyssey',
}: SiteNavProps) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const openLogin = useAdminStore((s) => s.openLogin)
  const cartTotalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const openCart = useCartStore((s) => s.openCart)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [brandFirstWord, ...brandRestWords] = brandName.split(' ')
  const brandAccent = brandRestWords.join(' ')

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

  const mobileNavItems = isAuthenticated
    ? [...baseMobileNavItems, { page: 'Admin', label: 'Admin', Icon: Shield }]
    : baseMobileNavItems

  const mobileDockGridClass = mobileNavItems.length === 5 ? 'grid-cols-5' : 'grid-cols-4'

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b border-[var(--border-warm)] bg-[#fff9f0f2] backdrop-blur-md"
        id="site-nav"
      >
        <div className="container flex items-center justify-between py-4">
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
              alt={`${brandName} Logo`}
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-[17px] font-semibold text-[var(--text-dark)]">
              {brandFirstWord}
              {brandAccent ? <span className="text-[#b97f50]"> {brandAccent}</span> : null}
            </span>
          </button>

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
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => onNavigate('Admin')}
                className={`text-[13px] font-semibold tracking-wide transition ${currentPage === 'Admin'
                  ? 'text-[#b97f50] underline decoration-[#b97f50] decoration-2 underline-offset-[10px]'
                  : 'text-[#b97f50] opacity-60 hover:opacity-100'
                  }`}
              >
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="icon-button relative"
              aria-label="Cart"
              onClick={openCart}
            >
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
              {cartTotalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#C05A3E] px-1 text-[10px] font-bold leading-none text-white">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-4 bottom-4 z-40 md:hidden"
        aria-label="Mobile bottom navigation"
      >
        <div
          className={`grid ${mobileDockGridClass} rounded-[28px] border border-[var(--border-warm)] bg-[#fff9f0e8] p-2 shadow-[0_18px_40px_rgba(44,34,24,0.18)] backdrop-blur-xl`}
        >
          {mobileNavItems.map(({ page, label, Icon }) => {
            const isActive = currentPage === page
            return (
              <button
                key={page}
                type="button"
                aria-label={label}
                onClick={() => onNavigate(page)}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[20px] px-2 py-2.5 text-center transition ${isActive
                  ? 'bg-[#b97f50]/14 text-[#9b5e35]'
                  : 'text-[var(--text-mid)] hover:bg-white/70 hover:text-[var(--text-dark)]'
                  }`}
              >
                <Icon className={`h-[18px] w-[18px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.9]'}`} />
                <span className="text-[10px] font-semibold leading-none tracking-[0.06em]">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export type { PageKey }
