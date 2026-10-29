import { afterAll, beforeAll, expect, it } from 'vitest'
import { chromium, type Browser, type Page } from 'playwright'
import webpack from 'webpack'
import { createServer, type Server } from 'node:http'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

let browser: Browser
let server: Server
let output: string
let origin: string

beforeAll(async () => {
  output = await mkdtemp(path.join(tmpdir(), 'search-palette-browser-'))
  const compiler = webpack({
    mode: 'development',
    target: 'web',
    devtool: false,
    entry: path.resolve('test/fixtures/search-palette/index.tsx'),
    output: { path: output, filename: 'fixture.js', publicPath: '/' },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        'next/router$': path.resolve(
          'test/fixtures/search-palette/navigation.tsx'
        ),
        'next/link$': path.resolve(
          'test/fixtures/search-palette/navigation.tsx'
        )
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: path.resolve('test/search-palette-browser-loader.cjs')
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({ NODE_ENV: 'development' })
      })
    ]
  })
  await new Promise<void>((resolve, reject) =>
    compiler.run((error, stats) => {
      compiler.close(() => {
        if (error || stats?.hasErrors())
          reject(
            error || new Error(stats?.toString({ all: false, errors: true }))
          )
        else resolve()
      })
    })
  )
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url || '/', 'http://fixture.test').pathname
    if (pathname.endsWith('.js')) {
      try {
        const body = await readFile(path.join(output, path.basename(pathname)))
        response.setHeader('Content-Type', 'text/javascript')
        response.end(body)
      } catch {
        response.writeHead(404)
        response.end()
      }
    } else {
      response.setHeader('Content-Type', 'text/html')
      response.end(
        '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>'
      )
    }
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  if (!address || typeof address === 'string')
    throw new Error('Missing fixture address')
  origin = `http://127.0.0.1:${address.port}`
  browser = await chromium.launch()
}, 60000)

afterAll(async () => {
  await browser?.close()
  if (server?.listening)
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    )
  if (output) await rm(output, { recursive: true, force: true })
})

async function fixture(mobile: boolean) {
  const context = await browser.newContext({
    viewport: mobile
      ? { width: 375, height: 812 }
      : { width: 1280, height: 720 },
    isMobile: mobile,
    hasTouch: mobile
  })
  const requests: URL[] = []
  const errors: string[] = []
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin === origin) return route.continue()
    if (
      url.hostname === 'api.storyblok.com' &&
      url.pathname.endsWith('/spaces/me')
    ) {
      return route.fulfill({ json: { space: { version: 12345 } } })
    }
    if (
      url.hostname === 'api.storyblok.com' &&
      url.pathname.endsWith('/stories')
    ) {
      requests.push(url)
      return route.fulfill({
        json: {
          // Emulate the CMS filter, so broadening it accidentally returns unwanted results.
          stories: [
            { slug: 'page', component: 'page' },
            { slug: 'landing', component: 'page' },
            { slug: 'news', component: 'news' },
            { slug: 'event', component: 'event' },
            { slug: 'document', component: 'document' }
          ]
            .filter(({ component }) =>
              (url.searchParams.get('filter_query[component][in]') || '')
                .split(',')
                .includes(component)
            )
            .map(({ slug, component }, index) => ({
              id: index + 1,
              uuid: `result-${slug}`,
              name: `${slug} title`,
              slug,
              full_slug: `en/${slug}`,
              content: { component, preview_title: `${slug} title` }
            })),
          cv: 12345,
          rels: [],
          links: []
        },
        headers: { total: '2', 'per-page': '25' }
      })
    }
    errors.push(`Unexpected request: ${url.origin}${url.pathname}`)
    return route.abort()
  })
  const page = await context.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto(origin)
  await page
    .getByRole('button', { name: 'Search the site', exact: true })
    .waitFor()
  return { context, page, requests, errors }
}

async function search(page: Page, requests: URL[]) {
  const input = page.getByRole('dialog').getByRole('combobox')
  await input.fill('b')
  await page.waitForTimeout(450)
  expect(requests).toHaveLength(0)
  await input.fill('bali')
  await page.getByRole('option').first().waitFor()
  expect(await page.getByRole('option').count()).toBe(2)
  expect(requests).toHaveLength(1)
  expect(requests[0].searchParams.get('search_term')).toBe('bali')
  expect(requests[0].searchParams.get('filter_query[component][in]')).toBe(
    'page'
  )
  expect(requests[0].searchParams.get('version')).toBe('published')
  expect(requests[0].searchParams.get('starts_with')).toBe('en/')
  return input
}

it('desktop: accessible opener, modal focus, one shared palette, shortcuts and keyboard result navigation', async () => {
  const { context, page, requests, errors } = await fixture(false)
  try {
    const opener = page.getByRole('button', {
      name: 'Search the site',
      exact: true
    })
    expect(await opener.getAttribute('data-lm-search-mode')).toBe('input')
    expect((await opener.boundingBox())?.height).toBe(56)
    expect(await page.getByRole('combobox').count()).toBe(0)
    await opener.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await dialog.waitFor()
    await page.waitForFunction(
      () => document.activeElement?.tagName === 'INPUT'
    )
    const bounds = (await dialog.boundingBox())!
    expect(bounds.width).toBeLessThan(1280)
    expect(Math.abs(bounds.x + bounds.width / 2 - 640)).toBeLessThan(2)
    await page.keyboard.press('Control+k')
    await page.keyboard.press('Meta+k')
    expect(await dialog.count()).toBe(1)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      expect(
        await dialog.evaluate((el) => el.contains(document.activeElement))
      ).toBe(true)
    }
    await search(page, requests)
    // Content matches survive even when the query is absent from the title.
    expect(
      await dialog.getByText('landing title', { exact: true }).count()
    ).toBe(1)
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'detached' })
    expect(await opener.evaluate((el) => document.activeElement === el)).toBe(
      true
    )
    await page.keyboard.press('Control+k')
    await dialog.waitFor()
    expect(await dialog.getByRole('combobox').inputValue()).toBe('')
    await page.keyboard.press('Escape')
    await page
      .getByRole('button', { name: 'Other search', exact: true })
      .click()
    await page.getByRole('dialog', { name: 'Other search' }).waitFor()
    await page.getByRole('button', { name: 'Close search' }).click()
    await page.keyboard.press('Meta+k')
    await dialog.getByRole('combobox').fill('bali')
    await page.getByRole('option').first().waitFor()
    await page.keyboard.press('ArrowDown')
    const selected = await dialog
      .getByRole('combobox')
      .getAttribute('aria-activedescendant')
    const href = await page.locator(`[id="${selected}"] a`).getAttribute('href')
    await page.keyboard.press('Enter')
    await page.waitForURL(`${origin}${href}`)
    await page
      .getByRole('button', { name: 'Search the site', exact: true })
      .waitFor()
    expect(await page.getByRole('dialog').count()).toBe(0)
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
})

it('mobile: touch icon opens fullscreen search directly, closes with focus restoration and navigates a result', async () => {
  const { context, page, requests, errors } = await fixture(true)
  try {
    const opener = page.getByRole('button', {
      name: 'Search the site',
      exact: true
    })
    expect(await opener.getAttribute('data-lm-search-mode')).toBe('icon')
    expect(await page.getByRole('combobox').count()).toBe(0)
    await opener.tap()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor()
    await page.waitForFunction(
      () => document.activeElement?.tagName === 'INPUT'
    )
    // Wait for the transition before measuring the actual mobile paper.
    await page.waitForFunction(() => {
      const r = document
        .querySelector('[role="dialog"]')!
        .getBoundingClientRect()
      return (
        r.x === 0 &&
        r.y === 0 &&
        r.width === innerWidth &&
        r.height === innerHeight
      )
    })
    expect(await page.getByRole('dialog').count()).toBe(1)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
    await search(page, requests)
    await page.getByRole('button', { name: 'Close search' }).tap()
    await dialog.waitFor({ state: 'detached' })
    expect(await opener.evaluate((el) => document.activeElement === el)).toBe(
      true
    )
    await opener.tap()
    expect(await dialog.getByRole('combobox').inputValue()).toBe('')
    await dialog.getByRole('combobox').fill('bali')
    await page.getByRole('option').first().waitFor()
    await dialog.getByText('landing title', { exact: true }).tap()
    await page.waitForURL(`${origin}/landing`)
    await page
      .getByRole('button', { name: 'Search the site', exact: true })
      .waitFor()
    expect(await page.getByRole('dialog').count()).toBe(0)
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
})
