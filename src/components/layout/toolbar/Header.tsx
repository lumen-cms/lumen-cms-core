import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import TopAppBarWrap from './TopAppBar'
import { useSettings } from '../../provider/SettingsPageProvider'

function Header() {
  const settings = useSettings()

  let rows = settings.multi_toolbar || []
  let SystemBar = null
  if (rows?.length < 1) {
    return null
  }
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

export default Header
