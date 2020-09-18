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
  const settingsUid = settings?.uuid
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
    if (settingsUid !== stateSettings?.uuid) {
      // console.log('different settings', settingsUid, stateSettings.uuid)
      setSettings(settings)
    }
  }, [settingsUid, stateSettings, settings])

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
        //   fetch(
        //     `${window.location.protocol}//${window.location.host}/api/clear-cache`
        //   )
        //     .then(() => {
        //       console.log(
        //         'flush cashed successful triggered. ENV Vars:',
        //         this.previewToken,
        //         this.token
        //       )
        //       console.log('after flush: current token:', this.client.getToken())
        //       window.location.reload()
        //     })
        //     .catch((e) => {
        //       console.error('error on flush cache:', e)
        //     })
      })

      window.storyblok.on('input', (event) => {
        // console.log( content, event.story.content)

        // todo if this is still works after rewrite... maybe add one for settings as well..
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
        // if (event.story.content.component === 'static_container') {
        //   const newContainerContent = content.allStaticContent.filter((el:any) => el._uid !== event.story.content._uid)
        //   newContainerContent.push(event.story.content)
        //   console.log('input::input static container changed',newContainerContent)
        //   setContent({
        //     ...content,
        //     allStaticContent: newContainerContent
        //   })
        // }
      })
    }
  }, [page, settings])

  return [statePage, stateSettings]
}
