/**
 * Build-time prerenderer — visits each route with a headless browser and
 * saves the fully-rendered HTML so Googlebot sees real content immediately.
 *
 * Run automatically after `vite build` via the `build` npm script.
 */

import fs from 'fs'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(__dirname, '../dist')
const PORT = 4174

/** Routes to prerender — keep in sync with sitemap.xml */
const ROUTES = [
  '/',
  '/about',
  '/founders',
  '/investors',
  '/startups',
  '/events',
  '/community',
  '/resources',
  '/gallery',
  '/contact',
  '/sponsorship',
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.webp': 'image/webp',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
}

/** Minimal static-file server that falls back to index.html for SPA routes. */
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    const ext = path.extname(urlPath)
    let filePath = path.join(dist, urlPath)

    if (!ext || !fs.existsSync(filePath)) {
      filePath = path.join(dist, 'index.html')
    }

    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] ?? 'text/plain' })
    fs.createReadStream(filePath).pipe(res)
  })

  return new Promise((resolve) => server.listen(PORT, () => resolve(server)))
}

async function prerender() {
  if (!fs.existsSync(dist)) {
    console.error('❌  dist/ not found — run `vite build` first.')
    process.exit(1)
  }

  const server = await startServer()
  console.log(`\n🌐  Serving dist/ on http://localhost:${PORT}`)

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  page.on('console', () => {})
  page.on('pageerror', () => {})

  let ok = 0, fail = 0

  for (const route of ROUTES) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle2',
        timeout: 30_000,
      })

      // Give React a moment to finish any synchronous rendering
      await new Promise((r) => setTimeout(r, 400))

      const html = await page.content()

      // Write to dist/<route>/index.html (dist/index.html for /)
      const outDir = route === '/' ? dist : path.join(dist, route.replace(/^\//, ''))
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8')

      console.log(`  ✓  ${route}`)
      ok++
    } catch (err) {
      console.error(`  ✗  ${route}  — ${err.message}`)
      fail++
    }
  }

  await browser.close()
  server.close()

  console.log(`\n✅  Done — ${ok} routes pre-rendered${fail ? `, ${fail} failed` : ''}\n`)
  if (fail > 0) process.exit(1)
}

prerender().catch((err) => {
  console.error('\n❌  Prerender crashed:', err)
  process.exit(1)
})
