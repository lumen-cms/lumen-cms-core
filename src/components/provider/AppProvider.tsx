import React, { FunctionComponent, useState } from 'react'
import { AppContext, AppContextProps } from '@context/AppContext'

const AppProvider: FunctionComponent<{ content: AppContextProps }> = ({
  children,
  content
}) => {
  const [val] = useState<AppContextProps>(content)
  return <AppContext.Provider value={val}>{children}</AppContext.Provider>
}
AppProvider.displayName = 'AppProvider'

export default AppProvider
