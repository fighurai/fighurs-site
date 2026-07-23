import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Nav } from './components/Nav'
import { SiteFooter } from './components/SiteFooter'
import { SmileyCursor } from './components/SmileyCursor'
import { SmoothScroll } from './components/SmoothScroll'
import { HomePage } from './pages/HomePage'
import { MagazinePage } from './pages/MagazinePage'
import { ShopPage } from './pages/ShopPage'
import { AboutPage } from './pages/AboutPage'
import { InterviewPage } from './pages/InterviewPage'

const IssueReaderPage = lazy(() =>
  import('./pages/IssueReaderPage').then((m) => ({ default: m.IssueReaderPage })),
)

function ReaderFallback() {
  return (
    <main className="page" style={{ padding: '6rem 1.25rem', fontFamily: 'var(--font-mono)' }}>
      Loading flip magazine…
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="site-shell">
          <div className="grain" aria-hidden />
          <SmileyCursor />
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/magazine" element={<MagazinePage />} />
            <Route
              path="/magazine/:slug"
              element={
                <Suspense fallback={<ReaderFallback />}>
                  <IssueReaderPage />
                </Suspense>
              }
            />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <SiteFooter />
        </div>
      </SmoothScroll>
    </BrowserRouter>
  )
}
