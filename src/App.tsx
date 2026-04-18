import { useState, useEffect } from 'react'
import { SiteNav, type PageKey } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { AdminLoginModal } from './components/AdminLoginModal'
import { HomePage } from './pages/HomePage'
import { ChairsPage } from './pages/ChairsPage'
import { TablesPage } from './pages/TablesPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { AdminPage } from './pages/AdminPage'
import { useAdminStore } from './stores/useAdminStore'
import { usePageContentStore } from './stores/usePageContentStore'

function App() {
  const [page, setPage] = useState<PageKey>('Home')
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const loadContent = usePageContentStore((s) => s.loadContent)
  const isLoading = usePageContentStore((s) => s.isLoading)

  const brandName = 'Furniture Odyssey'

  /* Load global page content once on mount */
  useEffect(() => {
    loadContent()
  }, [loadContent])

  /* Guard: redirect away from Admin if not authenticated */
  useEffect(() => {
    if (page === 'Admin' && !isAuthenticated) {
      setPage('Home')
    }
  }, [page, isAuthenticated])

  /* Reset scroll to top on page change */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-cream)]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <p className="mt-4 font-display text-xl text-[var(--text-dark)]">Loading Sanctuary...</p>
        </div>
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

      <main className="container space-y-24 py-12">
        {page === 'Home' && <HomePage onNavigate={setPage} />}
        {page === 'Chairs' && <ChairsPage />}
        {page === 'Tables' && <TablesPage />}
        {page === 'Collections' && <CollectionsPage />}
        {page === 'Admin' && isAuthenticated && <AdminPage />}
      </main>

      <SiteFooter brandName={brandName} onNavigate={setPage} />

      {/* Admin login modal — always mounted, visibility from store */}
      <AdminLoginModal />
    </div>
  )
}

export default App
