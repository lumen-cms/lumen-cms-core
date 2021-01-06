import React, { FunctionComponent, useEffect, useState } from 'react'
import { AppSettingsContext } from '@context/AppSettingsContext'
import { GlobalStoryblok } from '../../typings/generated/components-schema'

const AppSettingsProvider: FunctionComponent<{ settings: GlobalStoryblok }> = ({
  children,
  settings
}) => {
  const [val, setValue] = useState<GlobalStoryblok>(settings)

  useEffect(() => {
    if (val?.uuid !== settings?.uuid) {
      // console.log('different settings', settingsUid, stateSettings.uuid)
      setValue(settings)
    }
  }, [val, settings, setValue])

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
AppSettingsProvider.displayName = 'AppSettingsProvider'

export default AppSettingsProvider
