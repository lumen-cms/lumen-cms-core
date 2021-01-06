import { useEffect, useState } from 'react'
import { AppPageProps } from '../../typings/app'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

export function useStoryblokComposer({
  page,
  settings
}: Pick<AppPageProps, 'settings' | 'page'>) {
  const pageUid = page?.uuid

  const [statePage, setPage] = useState<AppPageProps['page']>(page)
  const [stateSettings, setSettings] = useState<AppPageProps['settings']>(
    settings
  )

  useEffect(() => {
    if (pageUid !== statePage?.uuid) {
      // console.log('different page', pageUid, statePage.uuid)
      setPage(page)
    }
  }, [pageUid, statePage, page])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.storyblok) {
      window.storyblok.init()
      window.storyblok.on(['change'], () => {
        console.log('change::save triggered')
        window.location.reload()
      })
      window.storyblok.on(['published', 'unpublished'], () => {
        console.log('published triggered')
        window.location.reload()
      })

      window.storyblok.on('input', (event) => {
        const newContent = { ...event?.story.content, uuid: event?.story.uuid }
        if (
          event?.story.content.component === 'page' &&
          event?.story.uuid === page?.uuid
        ) {
          console.log('input::input content changed')
          setPage(
            window.storyblok.addComments(
              newContent,
              event?.story.id
            ) as PageStoryblok
          )
        }
        if (
          event?.story.content.component === 'global' &&
          event?.story.uuid === settings?.uuid
        ) {
          console.log('input::input settings changed')
          setSettings(
            window.storyblok.addComments(
              newContent,
              event?.story.id
            ) as GlobalStoryblok
          )
        }
      })
    }
  }, [page, settings])

  return [statePage, stateSettings]
}
