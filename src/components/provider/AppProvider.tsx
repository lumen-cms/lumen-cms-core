import React, { FunctionComponent, useEffect, useState } from 'react'
import { AppContext, AppContextProps } from '@context/AppContext'

const AppProvider: FunctionComponent<
  React.PropsWithChildren<{ content: AppContextProps }>
> = ({ children, content }) => {
  const [appContent, setAppContent] = useState<AppContextProps>(content)
  useEffect(() => {
    if (content.locale !== appContent.locale) {
      setAppContent((prevState) => ({ ...prevState, locale: content.locale }))
    }
  }, [appContent.locale, content.locale])
  useEffect(() => {
    if (content.slug !== appContent.slug) {
      setAppContent((prevState) => ({ ...prevState, slug: content.slug }))
    }
  }, [appContent.slug, content.slug])
  return (
    <AppContext.Provider value={appContent}>{children}</AppContext.Provider>
  )
}
AppProvider.displayName = 'AppProvider'

export default AppProvider
