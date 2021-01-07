import React, { FunctionComponent, useEffect, useState } from 'react'
import { AppSettingsContext } from '@context/AppSettingsContext'
import { GlobalStoryblok } from '../../typings/generated/components-schema'

const AppSettingsProvider: FunctionComponent<{ settings: GlobalStoryblok }> = ({
  children,
  settings
}) => {
  const [val, setValue] = useState<GlobalStoryblok>(settings)
  const uuid = val?.uuid
  useEffect(() => {
    if (uuid !== settings?.uuid) {
      setValue(settings)
    }
  }, [uuid, settings, setValue])
  console.log('render')

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
