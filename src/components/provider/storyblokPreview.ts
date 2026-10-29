import { loadStoryblokBridge } from '@storyblok/react'
import type StoryblokBridge from '@storyblok/preview-bridge'
import type { ISbStoryData } from 'storyblok-js-client'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { defaultResolveRelations } from '../../utils/universal/storyblokParamsHelper'

export function subscribeStoryblokPreview({
  pageUuid,
  settingsUuid,
  setPage,
  setSettings
}: {
  pageUuid?: string
  settingsUuid?: string
  setPage: (page: PageStoryblok) => void
  setSettings: (settings: GlobalStoryblok) => void
}) {
  let cancelled = false
  let bridge: StoryblokBridge | undefined
  loadStoryblokBridge()
    .then(() => {
      if (cancelled) return
      bridge = new window.StoryblokBridge({
        resolveRelations: defaultResolveRelations.split(','),
        resolveLinks: 'url'
      }) as unknown as StoryblokBridge
      bridge.on('input', (event) => {
        const story = event.story as unknown as ISbStoryData<
          GlobalStoryblok | PageStoryblok
        >
        if (cancelled || !story?.content) return
        const content = { ...story.content, uuid: story.uuid }
        if (
          story.content.component === 'global' &&
          story.uuid === settingsUuid
        ) {
          setSettings(content as GlobalStoryblok)
        } else if (story.uuid === pageUuid) {
          setPage(content as PageStoryblok)
        }
      })
      bridge.on(['change', 'published'], (event) => {
        if (
          !cancelled &&
          (event.action === 'published' || ('reload' in event && event.reload))
        )
          window.location.reload()
      })
    })
    .catch((error) => {
      if (!cancelled)
        console.error('[Storyblok] Could not load preview bridge', error)
    })
  return () => {
    cancelled = true
    bridge?.destroy()
  }
}
