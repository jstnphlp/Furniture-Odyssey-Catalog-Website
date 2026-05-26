import { useState, useEffect, useRef } from 'react'
import { SiteNav, type PageKey } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { CartDrawer } from './components/CartDrawer'
import { HomePage } from './pages/HomePage'
import { ChairsPage } from './pages/ChairsPage'
import { TablesPage } from './pages/TablesPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { usePageContentStore } from './stores/usePageContentStore'
import { LoadingJoineryTable } from './components/LoadingJoineryTable'

const LOADING_JOINERY_CYCLE_MS = 2400
const pageRoutes: Record<PageKey, string> = {
  Home: '/',
  Chairs: '/chairs',
  Tables: '/tables',
  Collections: '/collections',
}

const routePages = Object.entries(pageRoutes).reduce<Record<string, PageKey>>(
  (routes, [page, route]) => {
    routes[route] = page as PageKey
    return routes
  },
  {},
)

const getPageFromPath = (path: string): PageKey => {
  const normalizedPath = path.replace(/\/+$/, '') || '/'
  return routePages[normalizedPath] ?? 'Home'
}

function App() {
  const [page, setPage] = useState<PageKey>(() => getPageFromPath(window.location.pathname))
  const loadContent = usePageContentStore((s) => s.loadContent)
  const isLoading = usePageContentStore((s) => s.isLoading)
  const [splashPhase, setSplashPhase] = useState<'hidden' | 'loading' | 'finishing'>(
    isLoading ? 'loading' : 'hidden',
  )
  const [splashRunId, setSplashRunId] = useState(0)
  const previousLoadingRef = useRef(isLoading)

  const brandName = 'Furniture Odyssey'

  const handleNavigate = (nextPage: PageKey) => {
    setPage(nextPage)
    const nextPath = pageRoutes[nextPage]
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  /* Load global page content once on mount */
  useEffect(() => {
    loadContent()
  }, [loadContent])

  useEffect(() => {
    let transitionTimer: number | undefined

    if (isLoading) {
      transitionTimer = window.setTimeout(() => {
        setSplashPhase('loading')
      }, 0)
    } else if (previousLoadingRef.current) {
      transitionTimer = window.setTimeout(() => {
        setSplashRunId((current) => current + 1)
        setSplashPhase('finishing')
      }, 0)
    }

    previousLoadingRef.current = isLoading

    return () => {
      if (transitionTimer) window.clearTimeout(transitionTimer)
    }
  }, [isLoading])

  useEffect(() => {
    if (splashPhase !== 'finishing') return

    const finishTimer = window.setTimeout(() => {
      setSplashPhase('hidden')
    }, LOADING_JOINERY_CYCLE_MS)

    return () => {
      window.clearTimeout(finishTimer)
    }
  }, [splashPhase, splashRunId])

  const showSplash = splashPhase !== 'hidden'

  /* Reset scroll to top on page change */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  if (showSplash) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-cream)]">
        <LoadingJoineryTable
          key={splashRunId}
          isFinishing={splashPhase === 'finishing'}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] text-[var(--text-dark)]">
      <SiteNav
        currentPage={page}
        onNavigate={handleNavigate}
        brandName={brandName}
      />

      <main className="container space-y-24 py-12 pb-32 md:pb-12">
        {page === 'Home' && <HomePage onNavigate={handleNavigate} />}
        {page === 'Chairs' && <ChairsPage />}
        {page === 'Tables' && <TablesPage />}
        {page === 'Collections' && <CollectionsPage />}
      </main>

      <div className="pb-28 md:pb-0">
        <SiteFooter brandName={brandName} onNavigate={handleNavigate} />
      </div>

      {/* Cart drawer — always mounted, visibility from store */}
      <CartDrawer />
    </div>
  )
}

export default App
