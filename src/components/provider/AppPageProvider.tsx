import React, { FunctionComponent, useEffect, useState } from 'react'
import { AppPageContext } from '@context/AppPageContext'
import { useAppSettings } from '@context/AppSettingsContext'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

const AppPageProvider: FunctionComponent<{ page: PageStoryblok | null }> = ({
  children,
  page
}) => {
  const { settings, setSettings } = useAppSettings()
  const [value, setPage] = useState<PageStoryblok | null>(page)

  useEffect(() => {
    if (value?.uuid !== page?.uuid) {
      // console.log('different page', pageUid, statePage.uuid)
      setPage(page)
    }
  }, [value, page, setPage])

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
  }, [page, settings, setSettings, setPage])

  return (
    <AppPageContext.Provider
      value={{
        page: value
      }}
    >
      {children}
    </AppPageContext.Provider>
  )
}
AppPageProvider.displayName = 'AppPageProvider'

export default AppPageProvider
