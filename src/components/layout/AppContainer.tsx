import React, { FunctionComponent } from 'react'
import Error from 'next/error'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'
import { LmAppProvidersContainer } from './LmAppProvidersContainer'
import { AppContainerProps } from './layoutTypes'
import { AppStoreProvider, useHydrate } from '../../utils/state/appState'

export const AppContainer: FunctionComponent<AppContainerProps> = ({
  content,
  children
}) => {
  // const set = useAppStore.getState().settings
  // const pag = useAppStore.getState().page
  const { page, settings, error, ...rest } = content
  const store = useHydrate({
    settings,
    page,
    drawerVariant: settings?.drawer_variant || 'temporary'
  })
  // settings && set?.uuid !== settings?.uuid && useAppStore.setState({ settings })
  // page && !pag.uuid && useAppStore.setState({ page })
  // useEffect(() => {
  //   if (page && pag.uuid !== page?.uuid) {
  //     useAppStore.setState({ page })
  //   } else if (!page && pag.uuid) {
  //     useAppStore.setState({ page: {} }) // reset if page is not exist
  //   }
  // }, [pag.uuid, page])
  // useEffect(() => {
  //   if (settings && set.uuid !== settings?.uuid) {
  //     useAppStore.setState({ settings })
  //   }
  // }, [settings, set.uuid])
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && window.storyblok) {
  //     window.storyblok.init()
  //     window.storyblok.on(['change'], () => {
  //       console.log('change::save triggered')
  //       window.location.reload()
  //     })
  //     window.storyblok.on(['published', 'unpublished'], () => {
  //       console.log('published triggered')
  //       window.location.reload()
  //     })
  //
  //     window.storyblok.on('input', (event) => {
  //       const newContent = { ...event?.story.content, uuid: event?.story.uuid }
  //       if (
  //         event?.story.content.component === 'page' &&
  //         event?.story.uuid === page?.uuid
  //       ) {
  //         console.log('input::input content changed')
  //         const newPage = window.storyblok.addComments(
  //           newContent,
  //           event?.story.id
  //         ) as PageStoryblok
  //         useAppStore.setState({ page: newPage })
  //         // setPage(newPage)
  //       }
  //       if (
  //         event?.story.content.component === 'global' &&
  //         event?.story.uuid === settings?.uuid
  //       ) {
  //         console.log('input::input settings changed')
  //         const newSettings = window.storyblok.addComments(
  //           newContent,
  //           event?.story.id
  //         ) as GlobalStoryblok
  //         useAppStore.setState({ settings: newSettings })
  //         // setSettings(
  //         //   newSettings
  //         // )
  //       }
  //     })
  //   }
  // }, [page?.uuid, settings?.uuid])

  if (error) {
    return <Error statusCode={500} />
  }
  if (!settings) {
    return <Error statusCode={500} />
  }

  return (
    <AppStoreProvider store={store}>
      <AppProvider content={{ ...rest }}>
        <AppSetupProvider>
          <GlobalTheme>
            <LmAppProvidersContainer>{children}</LmAppProvidersContainer>
          </GlobalTheme>
        </AppSetupProvider>
      </AppProvider>
    </AppStoreProvider>
  )
}

AppContainer.displayName = 'AppContainer'
