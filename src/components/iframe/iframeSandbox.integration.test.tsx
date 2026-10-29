import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import { chromium, type Browser } from 'playwright'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement, type ComponentProps } from 'react'
import { getIframeSandbox } from './iframeSandbox'
import AppDocument from '../pages/_document'

vi.mock('next/document', () => ({
  Html: ({ children }: { children: React.ReactNode }) =>
    createElement('html', null, children),
  Head: ({ children }: { children: React.ReactNode }) =>
    createElement('head', null, children),
  Main: () => <main />,
  NextScript: () => createElement('script', { src: '/next.js' })
}))
vi.mock('../pages/DocumentGoogleFonts', () => ({
  DocumentGoogleFonts: () => null
}))

let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

it.each([
  'https://docs.google.com',
  'https://mysga.studentsgoabroad.com',
  'https://www.youtube.com'
])(
  'keeps provider scripts, storage and allowed form submissions working for %s',
  async (origin) => {
    const context = await browser.newContext()
    try {
      const src = `${origin}/fixture`
      const sandbox = getIframeSandbox(src, 'https://parent.test')
      await context.route('**/*', async (route) => {
        const url = new URL(route.request().url())
        const body =
          url.hostname === 'parent.test'
            ? `<iframe src="${src}" sandbox="${sandbox}"></iframe>`
            : url.pathname === '/submitted'
            ? '<p>Form submitted</p>'
            : `<form action="/submitted"><button>Submit</button></form><script>
              localStorage.setItem('sandbox-test', 'works');
              document.body.dataset.ready = localStorage.getItem('sandbox-test');
              try { top.location.href='https://escaped.test'; } catch {}
            </script>`
        await route.fulfill({ contentType: 'text/html', body })
      })
      const page = await context.newPage()
      await page.goto('https://parent.test')
      const iframe = page.frameLocator('iframe')
      await iframe.locator('body[data-ready="works"]').waitFor()
      expect(page.url()).toBe('https://parent.test/')
      if (sandbox.includes('allow-forms')) {
        await iframe.locator('button').click()
        await iframe.getByText('Form submitted').waitFor()
      }
    } finally {
      await context.close()
    }
  }
)

it('prevents same-origin frame scripts from reading parent DOM, storage, or removing the sandbox', async () => {
  const context = await browser.newContext()
  try {
    await context.route('**/*', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body:
          new URL(route.request().url()).pathname === '/frame'
            ? `<script>
          const result = {};
          try { parent.document.body.dataset.escaped = 'yes'; result.parent = true } catch { result.parent = false }
          try { localStorage.setItem('escape', 'yes'); result.storage = true } catch { result.storage = false }
          result.frameElement = !!window.frameElement;
          parent.postMessage(result, '*');
          </script>`
            : `<script>window.addEventListener('message', event => { if(event.source === document.querySelector('iframe').contentWindow) window.result = event.data })</script><iframe src="/frame" sandbox="${getIframeSandbox(
                '/frame',
                'https://parent.test'
              )}"></iframe>`
      })
    )
    const page = await context.newPage()
    await page.goto('https://parent.test')
    await page.waitForFunction(() => 'result' in window)
    expect(await page.evaluate('window.result')).toEqual({
      parent: false,
      storage: false,
      frameElement: false
    })
    expect(await page.locator('iframe').getAttribute('sandbox')).not.toContain(
      'allow-same-origin'
    )
  } finally {
    await context.close()
  }
})

it('keeps the GTM noscript frame and its image requests working with JavaScript disabled', async () => {
  const previous = process.env.NEXT_PUBLIC_GTM_CONTAINER
  process.env.NEXT_PUBLIC_GTM_CONTAINER = 'GTM-TEST'
  const html =
    '<!doctype html>' +
    renderToStaticMarkup(
      <AppDocument
        {...({ __NEXT_DATA__: { props: {} } } as unknown as ComponentProps<
          typeof AppDocument
        >)}
      />
    )
  if (previous === undefined) delete process.env.NEXT_PUBLIC_GTM_CONTAINER
  else process.env.NEXT_PUBLIC_GTM_CONTAINER = previous
  expect(html).toContain('sandbox="allow-same-origin"')
  expect(html).toContain('<noscript>')
  expect(html).toContain('https://www.googletagmanager.com/ns.html?id=GTM-TEST')
  const context = await browser.newContext({ javaScriptEnabled: false })
  const requests: string[] = []
  try {
    await context.route('**/*', async (route) => {
      const url = route.request().url()
      requests.push(url)
      await route.fulfill({
        contentType: 'text/html',
        body: url.startsWith('https://parent.test')
          ? html
          : url.includes('/ns.html')
          ? '<img src="https://pixel.test/noscript">'
          : ''
      })
    })
    const page = await context.newPage()
    await page.goto('https://parent.test')
    expect(requests).toContain(
      'https://www.googletagmanager.com/ns.html?id=GTM-TEST'
    )
    expect(requests).toContain('https://pixel.test/noscript')
    expect(requests.some((url) => url.endsWith('/next.js'))).toBe(false)
  } finally {
    await context.close()
  }
})
