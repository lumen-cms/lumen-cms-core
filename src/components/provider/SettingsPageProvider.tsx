import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from 'react'
import { useRouter } from 'next/router'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

const SettingsContext = createContext<GlobalStoryblok>({} as GlobalStoryblok)
const PageContext = createContext<PageStoryblok>({} as PageStoryblok)

export const SettingsPageProvider: FC<{
  settings: GlobalStoryblok
  page?: PageStoryblok | null
}> = ({ settings, page, children }) => {
  const { isPreview } = useRouter() || {}
  const [stateSettings, setSettings] = useState(settings)
  const [statePage, setPage] = useState<PageStoryblok | null>(page || null)

  useEffect(() => {
    if (page && statePage?.uuid !== page?.uuid) {
      setPage(page)
    } else if (!page) {
      setPage(null)
    }
  }, [statePage?.uuid, page, setPage])
  useEffect(() => {
    if (settings && stateSettings?.uuid !== settings?.uuid) {
      setSettings(settings)
    }
  }, [settings, stateSettings.uuid, setSettings])

  function addBridge(callback: () => void) {
    // check if the script is already present
    const existingScript = document.getElementById('storyblokBridge')
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = '//app.storyblok.com/f/storyblok-v2-latest.js'
      script.id = 'storyblokBridge'
      document.body.appendChild(script)
      script.onload = () => {
        // once the scrip is loaded, init the event listeners
        callback()
      }
    } else {
      callback()
    }
  }

  useEffect(() => {
    // only load inside preview mode
    if (isPreview) {
      // first load the bridge, then initialize the event listeners
      const initEventListeners = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof StoryblokBridge !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const storyblokInstance = new StoryblokBridge()

          storyblokInstance.on(['change', 'published', 'unpublished'], () => {
            console.log('published triggered')
            window.location.reload()
          })

          storyblokInstance.on('input', (event: any) => {
            console.log(event)
            const newContent = {
              ...event?.story.content,
              uuid: event?.story.uuid
            }
            if (
              event?.story.content.component === 'page' &&
              event?.story.uuid === page?.uuid
            ) {
              console.log('input::input content changed')
              // const newPage = window.storyblok.addComments(
              //   newContent,
              //   event?.story.id
              // ) as PageStoryblok
              // setPage(newPage)
              setPage(newContent)
            }
            if (
              event?.story.content.component === 'global' &&
              event?.story.uuid === settings?.uuid
            ) {
              console.log('input::input settings changed')
              // const newSettings = window.storyblok.addComments(
              //   newContent,
              //   event?.story.id
              // ) as GlobalStoryblok
              // setSettings(newSettings)
              setSettings(newContent)
            }
          })
        }
      }

      addBridge(initEventListeners)
    }
  }, [isPreview, page?.uuid, settings?.uuid])

  return (
    <SettingsContext.Provider value={stateSettings}>
      <PageContext.Provider value={statePage as PageStoryblok}>
        {children}
      </PageContext.Provider>
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
export const usePage = () => useContext(PageContext)
