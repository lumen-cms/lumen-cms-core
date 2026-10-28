import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { loadStoryblokBridge } from '@storyblok/react'
import type StoryblokBridge from '@storyblok/preview-bridge'
import type { ISbStoryData } from 'storyblok-js-client'
import { defaultResolveRelations } from '../../utils/universal/storyblokParamsHelper'
import { useAppContext } from '@context/AppContext'

const SettingsContext = createContext<GlobalStoryblok>({} as GlobalStoryblok)
const PageContext = createContext<PageStoryblok>({} as PageStoryblok)

function SettingsPageProvider({
  settings,
  page,
  children
}: PropsWithChildren<{
  settings: GlobalStoryblok
  page?: PageStoryblok | null
}>) {
  const { insideStoryblok } = useAppContext()
  const [stateSettings, setSettings] = useState(settings)
  const [statePage, setPage] = useState<PageStoryblok | null>(page || null)
  // keep page in sync when props change
  useEffect(() => {
    setPage((prev) => {
      if (!page) return null
      if (prev?.uuid === page.uuid) return prev
      return page
    })
  }, [page])
  // keep settings in sync when props change
  useEffect(() => {
    setSettings((prev) => {
      if (!settings) return prev
      if (prev?.uuid === settings.uuid) return prev
      return settings
    })
  }, [settings])

  useEffect(() => {
    if (!insideStoryblok) return
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
            story.uuid === settings?.uuid
          ) {
            setSettings(content as GlobalStoryblok)
          } else if (story.uuid === page?.uuid) {
            setPage(content as PageStoryblok)
          }
        })
        bridge.on(['change', 'published'], (event) => {
          if (
            !cancelled &&
            (event.action === 'published' ||
              ('reload' in event && event.reload))
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
  }, [insideStoryblok, page?.uuid, settings?.uuid])

  return (
    <SettingsContext.Provider value={stateSettings}>
      <PageContext.Provider value={statePage as PageStoryblok}>
        {children}
      </PageContext.Provider>
    </SettingsContext.Provider>
  )
}

export default SettingsPageProvider

export const useSettings = () => useContext(SettingsContext)
export const usePage = () => useContext(PageContext)
