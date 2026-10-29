import React, { FunctionComponent, useMemo, useState } from 'react'
import { AppContext, AppContextProps } from './context/AppContext'

const AppProvider: FunctionComponent<
  React.PropsWithChildren<{ content: AppContextProps }>
> = ({ children, content }) => {
  // Other app settings retain their existing mount-time lifetime. Only the
  // route and locale track incoming props, without an effect-delayed render.
  const [initialContent] = useState<AppContextProps>(content)
  const appContent = useMemo(
    () => ({ ...initialContent, locale: content.locale, slug: content.slug }),
    [initialContent, content.locale, content.slug]
  )
  return (
    <AppContext.Provider value={appContent}>{children}</AppContext.Provider>
  )
}
AppProvider.displayName = 'AppProvider'

export default AppProvider
