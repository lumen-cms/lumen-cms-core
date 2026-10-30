import { beforeEach, expect, it, vi } from 'vitest'
import type { NextApiRequest, NextApiResponse } from 'next'
vi.mock('../utils/initial-props/storyblokPagesConfig', () => ({
  getAllStoriesOfProject: vi.fn(async () => [])
}))
vi.mock('./utils/travels', () => ({
  fetchTravels: vi.fn(async () => [{ slug: 'trip', updated_at: '2026-10-01' }])
}))
import coreSitemap from '../pages/api/sitemap'
import travelSitemap from './api/sitemap'
import { SSR_CONFIG } from '../utils/initial-props/ssrConfig'
import { fetchTravels } from './utils/travels'

beforeEach(() => {
  vi.clearAllMocks()
})
async function render(handler: typeof coreSitemap) {
  let xml = ''
  const response = {
    setHeader: vi.fn(),
    write: (value: string) => {
      xml += value
    },
    end: vi.fn()
  } as unknown as NextApiResponse
  await handler(
    { headers: { host: 'example.test' } } as NextApiRequest,
    response
  )
  return xml
}
it('keeps travel sitemap entries scoped to the opted-in handler', async () => {
  const hooks = [...SSR_CONFIG.ssrHooks.sitemap]
  vi.stubEnv('TRAVELS_SLUG', 'reisen')
  expect(await render(coreSitemap)).not.toContain('/reisen/trip')
  expect(fetchTravels).not.toHaveBeenCalled()
  expect(await render(travelSitemap)).toContain('/reisen/trip')
  expect(await render(coreSitemap)).not.toContain('/reisen/trip')
  expect(fetchTravels).toHaveBeenCalledTimes(1)
  expect(SSR_CONFIG.ssrHooks.sitemap).toEqual(hooks)
})
