import { useState, useEffect, useRef } from 'react'
import { SiteNav, type PageKey } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { AdminLoginModal } from './components/AdminLoginModal'
import { CartDrawer } from './components/CartDrawer'
import { HomePage } from './pages/HomePage'
import { ChairsPage } from './pages/ChairsPage'
import { TablesPage } from './pages/TablesPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { AdminPage } from './pages/AdminPage'
import { useAdminStore } from './stores/useAdminStore'
import { usePageContentStore } from './stores/usePageContentStore'
import { LoadingJoineryTable } from './components/LoadingJoineryTable'

const LOADING_JOINERY_CYCLE_MS = 2400

function App() {
  const [page, setPage] = useState<PageKey>('Home')
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const loadContent = usePageContentStore((s) => s.loadContent)
  const isLoading = usePageContentStore((s) => s.isLoading)
  const [splashPhase, setSplashPhase] = useState<'hidden' | 'loading' | 'finishing'>(
    isLoading ? 'loading' : 'hidden',
  )
  const [splashRunId, setSplashRunId] = useState(0)
  const previousLoadingRef = useRef(isLoading)

  const brandName = 'Furniture Odyssey'
  const visiblePage = page === 'Admin' && !isAuthenticated ? 'Home' : page

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
  }, [visiblePage])

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
        onNavigate={setPage}
        brandName={brandName}
      />

      <main className="container space-y-24 py-12 pb-32 md:pb-12">
        {visiblePage === 'Home' && <HomePage onNavigate={setPage} />}
        {visiblePage === 'Chairs' && <ChairsPage />}
        {visiblePage === 'Tables' && <TablesPage />}
        {visiblePage === 'Collections' && <CollectionsPage />}
        {visiblePage === 'Admin' && <AdminPage />}
      </main>

      <div className="pb-28 md:pb-0">
        <SiteFooter brandName={brandName} onNavigate={setPage} />
      </div>

      {/* Admin login modal — always mounted, visibility from store */}
      <AdminLoginModal />

      {/* Cart drawer — always mounted, visibility from store */}
      <CartDrawer />
    </div>
  )
}

export default App
