import React, { memo } from 'react'
import HeaderCustom from './HeaderCustom'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'

type LmHeaderProps = {
  settings: GlobalStoryblok
}

function Header({ settings }: LmHeaderProps): JSX.Element {
  if (settings.multi_toolbar && settings.multi_toolbar.length) {
    return <HeaderCustom settings={settings} />
  }
  return <div>simple toolbar does not exist any longer...</div>
}

export default memo(Header)
