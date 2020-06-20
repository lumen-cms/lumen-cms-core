import React, { FunctionComponent } from 'react'
import { AppContext, AppContextProps } from './context/AppContext'


const AppProvider: FunctionComponent<{ content: AppContextProps }> = ({ children, content }) => {
  return <AppContext.Provider value={content}>{children}</AppContext.Provider>
}
AppProvider.displayName = 'AppProvider'


export default AppProvider
