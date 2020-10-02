import React, { memo } from 'react'
import TopAppBarWrap from './TopAppBar'
import { AppHeaderProps } from './toolbarTypes'
import { LmComponentRender } from '../../CoreComponents'

function Header(props: AppHeaderProps): JSX.Element {
  const content = props.settings
  let rows = content.multi_toolbar || []

  let SystemBar = null
  const systemBarProps = rows.find((item) => item.is_system_bar)
  if (systemBarProps) {
    SystemBar = (
      <LmComponentRender content={systemBarProps} settings={content} />
    )
    // rows.splice(systemBarProps, 1)
    rows = rows.filter((i) => i._uid !== systemBarProps._uid)
  }
  return (
    <TopAppBarWrap {...props} SystemBar={SystemBar}>
      {rows.map((p) => (
        <LmComponentRender content={p} settings={content} key={p._uid} />
      ))}
    </TopAppBarWrap>
  )
}

export default memo(Header)
