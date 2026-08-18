import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './ThemeProvider.jsx'
import PortfolioDataProvider from './PortfolioDataProvider.jsx'

const AllProjects = lazy(() => import('./components/AllProjects.jsx'))
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy.jsx'))
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PortfolioDataProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#fafaf9] text-neutral-700 dark:bg-neutral-950 dark:text-neutral-100">Loading...</div>}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/projects" element={<AllProjects />} />
              <Route path="/projects/:slug" element={<ProjectCaseStudy />} />
              <Route path="/jabir/*" element={<AdminApp />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PortfolioDataProvider>
    </ThemeProvider>
  </StrictMode>,
)
