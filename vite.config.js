import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contentHandler from './api/content.js'
import sitemapHandler from './api/sitemap.js'
import loginHandler from './api/auth/login.js'
import sessionHandler from './api/auth/session.js'
import logoutHandler from './api/auth/logout.js'
import projectsHandler from './api/admin/projects/index.js'
import projectHandler from './api/admin/projects/[id].js'
import sectionsHandler from './api/admin/sections.js'
import passwordHandler from './api/admin/password.js'
import mediaSignHandler from './api/admin/media/sign.js'
import mediaDeleteHandler from './api/admin/media/delete.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(environment)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  const exactRoutes = new Map([
    ['/api/content', contentHandler],
    ['/api/sitemap', sitemapHandler],
    ['/api/auth/login', loginHandler],
    ['/api/auth/session', sessionHandler],
    ['/api/auth/logout', logoutHandler],
    ['/api/admin/projects', projectsHandler],
    ['/api/admin/sections', sectionsHandler],
    ['/api/admin/password', passwordHandler],
    ['/api/admin/media/sign', mediaSignHandler],
    ['/api/admin/media/delete', mediaDeleteHandler],
  ])

  const localApi = {
    name: 'local-vercel-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname
        let handler = exactRoutes.get(pathname)
        const projectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/)
        if (!handler && projectMatch) {
          request.query = { id: decodeURIComponent(projectMatch[1]) }
          handler = projectHandler
        }
        if (!handler) {
          next()
          return
        }
        try {
          await handler(request, response)
        } catch (error) {
          next(error)
        }
      })
    },
  }

  return {
    plugins: [localApi, react(), tailwindcss()],
  }
})
