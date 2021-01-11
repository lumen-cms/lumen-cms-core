import React, { memo } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import TopAppBarWrap from './TopAppBar'
import { useSettings } from '../../provider/SettingsPageProvider'

function Header(): JSX.Element {
  const settings = useSettings()

  let rows = settings.multi_toolbar || []
  console.log('header rendered')

  let SystemBar = null
  const systemBarProps = rows.find((item) => item.is_system_bar)
  if (systemBarProps) {
    SystemBar = <LmComponentRender content={systemBarProps} />
    // rows.splice(systemBarProps, 1)
    rows = rows.filter((i) => i._uid !== systemBarProps._uid)
  }
  return (
    <TopAppBarWrap SystemBar={SystemBar}>
      {rows.map((p) => (
        <LmComponentRender content={p} key={p._uid} />
      ))}
    </TopAppBarWrap>
  )
}

export default memo(Header)
