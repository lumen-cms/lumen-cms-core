import React, { FC } from 'react'
import { LmCoreComponents } from '@CONFIG'
import { useSettings } from '../provider/SettingsPageProvider'

export const LmAppProvidersContainer: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const settings = useSettings()
  const Providers = LmCoreComponents.lm_app_providers || []
  if (!Providers.length) {
    return <>{children}</>
  }
  let count = Providers.length - 1
  let LatestChild = children
  while (count >= 0) {
    LatestChild = React.createElement(
      Providers[count],
      { settings },
      LatestChild
    )
    count--
  }
  return <>{LatestChild}</>
}
