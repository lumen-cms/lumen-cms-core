import { AppPageProps } from '../../typings/app'
import { useEffect, useState } from 'react'
import StoryblokService from '../StoryblokService'

export const useStoryblok = (props: Pick<AppPageProps, 'page' | 'settings'>) => {
  // const { query } = useRouter() // query only set in SSR mode

  const { page, settings } = props
  // if (query) {
  //   StoryblokService.setQuery(query)
  // }
  // const insideStoryblok = !!query?._storyblok
  const settingsUid = props.settings?.uuid
  const pageUid = props.page?.uuid

  const [statePage, setPage] = useState<AppPageProps['page']>(page)
  const [stateSettings, setSettings] = useState<AppPageProps['settings']>(settings)

  useEffect(
    () => {
      if (pageUid !== statePage?.uuid) {
        // console.log('different page', pageUid, statePage.uuid)
        setPage(page)
      }
    },
    [pageUid, statePage, page]
  )

  useEffect(
    () => {
      if (settingsUid !== stateSettings?.uuid) {
        // console.log('different settings', settingsUid, stateSettings.uuid)
        setSettings(settings)
      }
    },
    [settingsUid, stateSettings, settings]
  )


  useEffect(
    () => {
      StoryblokService.initEditor({ page, setPage, settings, setSettings })
    },
    []
  )
  // return !insideStoryblok ? props : content
  // return content
  // console.log(props.page._uid)
  return {
    statePage,
    stateSettings
  }
}
