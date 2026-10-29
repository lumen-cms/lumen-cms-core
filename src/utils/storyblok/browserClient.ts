import type { ISbStoriesParams } from 'storyblok-js-client'
import { CONFIG } from '../config'
import { StoryblokTransport } from './StoryblokTransport'

const transport = new StoryblokTransport({
  requestsPerSecond: () => (process.env.NODE_ENV !== 'production' ? 6 : 4)
})

// Loaded by the widget's fetcher, not when its server-provided data is rendered.
// Browser search retains the service's published-only policy, even in preview.
export async function getBrowserStories(params: ISbStoriesParams = {}) {
  const current = await transport.parameters(
    params,
    CONFIG.publicToken,
    'published'
  )
  return transport.fetch(undefined, current)
}
