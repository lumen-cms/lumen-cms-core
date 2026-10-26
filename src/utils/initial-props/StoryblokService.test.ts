import { afterEach, expect, it, vi } from 'vitest'
import { CONFIG } from '@CONFIG'

const requests = vi.hoisted(() => ({
  getStory: vi.fn(
    async (_slug: string, params: { token: string; language?: string }) => ({
      data: {
        story: { name: `${params.token}:${params.language || 'default'}` }
      }
    })
  )
}))
vi.mock('storyblok-js-client', () => ({
  default: class {
    richTextResolver = {}
    getStory = requests.getStory
    get = vi.fn(async () => ({ data: { space: { version: 1 } } }))
  }
}))
import { LmStoryblokService } from './StoryblokService'

const originalConfig = { ...CONFIG }
afterEach(() => Object.assign(CONFIG, originalConfig))

it('keeps cached settings separate when switching sites and languages', async () => {
  vi.stubEnv('STORYBOOK', 'true')
  CONFIG.publicToken = 'test-space-one'
  const first = await LmStoryblokService.getStory('settings')
  CONFIG.publicToken = 'test-space-two'
  const second = await LmStoryblokService.getStory('settings')
  const german = await LmStoryblokService.getStory('settings', {
    language: 'de'
  })
  const cached = await LmStoryblokService.getStory('settings')
  expect(first.data.story.name).toBe('test-space-one:default')
  expect(second.data.story.name).toBe('test-space-two:default')
  expect(german.data.story.name).toBe('test-space-two:de')
  expect(cached).toBe(second)
  expect(requests.getStory).toHaveBeenCalledTimes(3)
})
