import React, { FC } from 'react'
import { LmCoreComponents } from '../..'

export const LmAppProvidersContainer: FC = ({ children }) => {
  const Providers = LmCoreComponents.lm_app_providers || []
  if (!Providers.length) {
    return <>{children}</>
  }
  let count = Providers.length - 1
  let LatestChild = children
  while (count >= 0) {
    LatestChild = React.createElement(Providers[count], {}, LatestChild)
    count--
  }
  return <>{LatestChild}</>
}
