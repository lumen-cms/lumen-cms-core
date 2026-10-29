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
import { useAppContext } from './context/AppContext'

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
  const [state, setState] = useState({ settings, page: page || null })
  const [previousInputs, setPreviousInputs] = useState({ page, settings })
  // Preview edits own state within a UUID. Reconcile both incoming identities
  // atomically before children render, preserving same-UUID edits.
  if (previousInputs.page !== page || previousInputs.settings !== settings) {
    setPreviousInputs({ page, settings })
    setState((prev) => ({
      page:
        previousInputs.page === page
          ? prev.page
          : !page
          ? null
          : prev.page?.uuid === page.uuid
          ? prev.page
          : page,
      settings:
        previousInputs.settings === settings ||
        !settings ||
        prev.settings?.uuid === settings.uuid
          ? prev.settings
          : settings
    }))
  }

  useEffect(() => {
    if (!insideStoryblok) return
    let cancelled = false
    let unsubscribe: (() => void) | undefined
    import('./storyblokPreview')
      .then(({ subscribeStoryblokPreview }) => {
        if (cancelled) return
        unsubscribe = subscribeStoryblokPreview({
          pageUuid: page?.uuid,
          settingsUuid: settings?.uuid,
          setPage: (page) => setState((prev) => ({ ...prev, page })),
          setSettings: (settings) => setState((prev) => ({ ...prev, settings }))
        })
      })
      .catch((error) => {
        if (!cancelled)
          console.error('[Storyblok] Could not load preview bridge', error)
      })
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [insideStoryblok, page?.uuid, settings?.uuid])

  return (
    <SettingsContext.Provider value={state.settings}>
      <PageContext.Provider value={state.page as PageStoryblok}>
        {children}
      </PageContext.Provider>
    </SettingsContext.Provider>
  )
}

export default SettingsPageProvider

export const useSettings = () => useContext(SettingsContext)
export const usePage = () => useContext(PageContext)
