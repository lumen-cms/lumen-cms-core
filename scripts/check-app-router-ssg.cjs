// Production contract probe for the App Router migration. No CMS/network data.
// Usage: node scripts/check-app-router-ssg.cjs [report.json]
// Keeps its isolated fixture and logs in the ignored .next-reference directory.
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const { createServer } = require('node:net')

const repo = path.resolve(__dirname, '..')
const nextBin = require.resolve('next/dist/bin/next')
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let fixture
let server

async function write(relative, content) {
  const file = path.join(fixture, relative)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content)
}

async function build(logName) {
  const child = spawn(process.execPath, [nextBin, 'build'], {
    cwd: fixture,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  let output = ''
  child.stdout.on('data', (chunk) => {
    output += chunk
  })
  child.stderr.on('data', (chunk) => {
    output += chunk
  })
  const timer = setTimeout(() => child.kill('SIGTERM'), 180000)
  try {
    const [code] = await once(child, 'close')
    await write(logName, output)
    return { code, output }
  } finally {
    clearTimeout(timer)
  }
}

async function unusedPort() {
  const listener = createServer()
  listener.listen(0, '127.0.0.1')
  await once(listener, 'listening')
  const port = listener.address().port
  await new Promise((resolve, reject) =>
    listener.close((error) => (error ? reject(error) : resolve()))
  )
  return port
}

async function main() {
  await fs.mkdir(path.join(repo, '.next-reference'), { recursive: true })
  fixture = await fs.mkdtemp(path.join(repo, '.next-reference/app-router-ssg-'))
  await fs.symlink(
    path.join(repo, 'node_modules'),
    path.join(fixture, 'node_modules'),
    'dir'
  )
  await write(
    'package.json',
    JSON.stringify({ private: true, name: 'lumen-static-contract-probe' })
  )
  await write(
    'next.config.js',
    `module.exports = {
    cacheComponents: false,
    turbopack: { root: ${JSON.stringify(repo)} }
  }\n`
  )
  await write(
    'app/layout.jsx',
    `export default function Layout({ children }) {
    return <html lang="en"><body>{children}</body></html>
  }\n`
  )
  await write(
    'app/Counter.jsx',
    `'use client'
  import { useState } from 'react'
  export default function Counter() {
    const [count, setCount] = useState(0)
    return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
  }\n`
  )
  await write(
    'app/[slug]/page.jsx',
    `import { appendFileSync } from 'node:fs'
  import { notFound } from 'next/navigation'
  import Link from 'next/link'
  import Counter from '../Counter'

  export const dynamic = 'error'
  export const dynamicParams = true
  export const revalidate = false

  export function generateStaticParams() { return [{ slug: 'built' }] }

  export default async function Page({ params }) {
    const { slug } = await params
    appendFileSync(${JSON.stringify(path.join(fixture, 'renders.log'))}, slug + '\\n')
    if (!['built', 'new'].includes(slug)) notFound()
    return <main>
      <h1>Published content: {slug}</h1>
      <p>This content is complete before JavaScript runs.</p>
      <Counter />
      <Link href={slug === 'built' ? '/new' : '/built'} prefetch={false}>Other page</Link>
    </main>
  }\n`
  )

  console.log('Building isolated SSG fixture:', path.relative(repo, fixture))
  const built = await build('build.log')
  assert.equal(built.code, 0, built.output)
  const manifest = JSON.parse(
    await fs.readFile(
      path.join(fixture, '.next/prerender-manifest.json'),
      'utf8'
    )
  )
  assert.equal(manifest.routes['/built'].initialRevalidateSeconds, false)
  const buildHtml = await fs.readFile(
    path.join(fixture, '.next/server/app/built.html'),
    'utf8'
  )
  assert.match(buildHtml, /Published content: (?:<!-- -->)?built/)
  await assert.rejects(
    fs.access(path.join(fixture, '.next/server/app/new.html'))
  )
  const renders = () => fs.readFile(path.join(fixture, 'renders.log'), 'utf8')
  const afterBuild = await renders()

  const port = await unusedPort()
  const origin = `http://127.0.0.1:${port}`
  server = spawn(
    process.execPath,
    [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)],
    {
      cwd: fixture,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  )
  let serverOutput = ''
  let serverError
  server.on('error', (error) => {
    serverError = error
  })
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk
  })
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk
  })
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (serverError) throw serverError
    if (server.exitCode !== null) throw new Error(serverOutput)
    try {
      const response = await fetch(`${origin}/built`, {
        signal: AbortSignal.timeout(1000)
      })
      await response.text()
      if (response.ok) {
        ready = true
        break
      }
    } catch {}
    await pause(100)
  }
  assert.ok(ready, 'Production server did not become ready')

  async function get(url, headers) {
    const response = await fetch(`${origin}${url}`, {
      headers,
      signal: AbortSignal.timeout(10000)
    })
    return {
      status: response.status,
      cache: response.headers.get('x-nextjs-cache'),
      contentType: response.headers.get('content-type'),
      body: await response.text()
    }
  }
  const known = await get('/built')
  assert.equal(known.status, 200)
  assert.equal(
    await renders(),
    afterBuild,
    'A build-generated page rendered at request time'
  )
  const first = await get('/new')
  assert.equal(first.status, 200)
  assert.match(first.body, /Published content: (?:<!-- -->)?new/)
  const afterFirst = await renders()
  assert.ok(
    afterFirst.length > afterBuild.length,
    'New page did not generate on first visit'
  )
  const second = await get('/new')
  assert.equal(second.status, 200)
  assert.equal(second.body, first.body)
  assert.equal(
    await renders(),
    afterFirst,
    'A repeat visit regenerated the page'
  )
  const flight = await get('/new?_rsc=probe', { RSC: '1' })
  assert.equal(flight.status, 200)
  assert.match(flight.contentType, /text\/x-component/)
  assert.match(flight.body, /Published content:/)
  assert.equal(
    await renders(),
    afterFirst,
    'RSC navigation regenerated the page'
  )
  const missing = await get('/missing')
  assert.equal(missing.status, 404)
  const afterMissing = await renders()

  const { chromium } = require('playwright')
  const browser = await chromium.launch({ headless: true })
  const browserErrors = []
  try {
    const page = await browser.newPage()
    page.on('pageerror', (error) => browserErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })
    await page.goto(`${origin}/built`)
    await page.getByRole('button', { name: 'Count: 0' }).click()
    await page.getByRole('button', { name: 'Count: 1' }).waitFor()
    await page.getByRole('link', { name: 'Other page' }).click()
    await page.waitForURL(`${origin}/new`)
    await page
      .getByRole('heading', { name: 'Published content: new' })
      .waitFor()
    await page.getByRole('button', { name: 'Count: 0' }).click()
    await page.getByRole('button', { name: 'Count: 1' }).waitFor()
    assert.deepEqual(browserErrors, [])
    assert.equal(
      await renders(),
      afterMissing,
      'Browser navigation regenerated cached content'
    )
    const withoutJs = await browser.newContext({ javaScriptEnabled: false })
    const staticPage = await withoutJs.newPage()
    await staticPage.goto(`${origin}/built`)
    await staticPage
      .getByRole('heading', { name: 'Published content: built' })
      .waitFor()
    await withoutJs.close()
  } finally {
    await browser.close()
  }
  server.kill('SIGTERM')
  await once(server, 'close')
  server = undefined
  await write('server.log', serverOutput)

  // A deliberate regression must fail the production build, even in Suspense.
  await write(
    'app/bad/page.jsx',
    `import { cookies } from 'next/headers'
  import { Suspense } from 'react'
  export const dynamic = 'error'
  async function RequestContent() {
    const jar = await cookies()
    return <p>{jar.get('user')?.value || 'anonymous'}</p>
  }
  export default function Page() {
    return <Suspense fallback={<p>Loading</p>}><RequestContent /></Suspense>
  }\n`
  )
  console.log('Checking that request-time rendering is rejected by the build')
  const rejected = await build('expected-static-guard-failure.log')
  assert.notEqual(
    rejected.code,
    0,
    'Request-time cookies unexpectedly built successfully'
  )
  assert.match(rejected.output, /cookies/)
  assert.match(rejected.output, /dynamic.*error|STATIC_GEN_BAILOUT/)
  await fs.rm(path.join(fixture, 'app/bad'), { recursive: true })

  const report = {
    verifiedAt: new Date().toISOString(),
    nextVersion: require('next/package.json').version,
    nodeVersion: process.version,
    bundler: 'Turbopack',
    fixture: path.relative(repo, fixture),
    policy: {
      cacheComponents: false,
      dynamic: 'error',
      dynamicParams: true,
      revalidate: false
    },
    checks: {
      buildPrerenderedKnownPage: true,
      knownPageHasNoRequestTimeRender: true,
      firstUnknownPublishedPageGenerated: true,
      repeatRequestHasNoRender: true,
      rscRequestHasNoRender: true,
      missingPage404: true,
      clientInteractionAndNavigation: true,
      contentVisibleWithoutJavaScript: true,
      cookiesInsideSuspenseFailBuild: true
    },
    cacheHeaders: {
      known: known.cache,
      firstNew: first.cache,
      repeatedNew: second.cache,
      rsc: flight.cache
    },
    browserErrors,
    limitations:
      'Synthetic routes validate the rendering contract, not CMS/MUI/preview compatibility, deployment cache durability, concurrent cold misses, or a production performance improvement. The deliberate failed build replaces fixture build output; rerun the probe to rebuild.'
  }
  const reportPath = path.resolve(
    process.argv[2] || path.join(fixture, 'report.json')
  )
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
  console.log('Report:', reportPath)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    server?.kill('SIGTERM')
  })
