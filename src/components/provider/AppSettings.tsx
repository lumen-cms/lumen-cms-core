import React, { FunctionComponent, useState } from 'react'
import { AppSettingsContext } from '@context/AppSettingsContext'
import { GlobalStoryblok } from '../../typings/generated/components-schema'

const AppSettingsProvider: FunctionComponent<{ settings: GlobalStoryblok }> = ({
  children,
  settings
}) => {
  const [val, setValue] = useState<GlobalStoryblok>(settings)
  return (
    <AppSettingsContext.Provider
      value={{
        settings: val,
        setSettings: setValue
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  )
}
AppSettingsProvider.displayName = 'AppProvider'

export default AppSettingsProvider
