import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { URL } from 'url'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

// Shim Vercel serverless handlers for local dev.
// Converts Vite's connect middleware (node http) into
// the (req, res) shape Vercel handlers expect, adding
// req.query parsing so handlers work unchanged.
function vercelApiPlugin() {
  return {
    name: 'vercel-api-shim',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()

        // Parse route: /api/search-artist?q=foo -> api/search-artist
        const parsed = new URL(req.url, 'http://localhost')
        const route = parsed.pathname.replace(/^\//, '').replace(/\/$/, '')

        // Convert searchParams to a plain object for req.query
        const query = Object.fromEntries(parsed.searchParams.entries())
        req.query = query

        // Build a minimal Vercel-like res object
        const fakeRes = {
          statusCode: 200,
          headers: {},
          setHeader(k, v) { this.headers[k] = v },
          status(code) { this.statusCode = code; return this },
          json(body) {
            res.writeHead(this.statusCode, {
              'Content-Type': 'application/json',
              ...this.headers,
            })
            res.end(JSON.stringify(body))
          },
        }

        try {
          const handlerPath = path.resolve(__dirname, route + '.js')
          // Bust module cache on every request so edits are picked up
          const mod = await import(handlerPath + '?t=' + Date.now())
          await mod.default(req, fakeRes)
        } catch (err) {
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          }
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiPlugin()],
  server: {
    allowedHosts: true,
  },
})
