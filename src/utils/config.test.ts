import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => vi.resetModules())

it('keeps preview credentials off browser config even in preview mode', async () => {
  vi.resetModules()
  vi.stubGlobal('window', {})
  vi.stubEnv('STORYBLOK_PREVIEW_TOKEN', 'server-preview-sentinel')
  vi.stubEnv('NEXT_PUBLIC_PREVIEW_TOKEN', 'legacy-preview-sentinel')
  vi.stubEnv('NEXT_PUBLIC_PREVIEW_MODE', 'true')
  vi.stubEnv('NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY', 'published-only')
  const { CONFIG } = await import('./config')
  expect(CONFIG.previewToken).toBe('')
  expect(CONFIG.publicToken).toBe('published-only')
  expect(JSON.stringify(CONFIG)).not.toContain('preview-sentinel')
})

it('loads the unprefixed preview credential on the server', async () => {
  vi.resetModules()
  vi.stubEnv('STORYBLOK_PREVIEW_TOKEN', 'server-preview-sentinel')
  const { CONFIG } = await import('./config')
  expect(CONFIG.previewToken).toBe('server-preview-sentinel')
})
