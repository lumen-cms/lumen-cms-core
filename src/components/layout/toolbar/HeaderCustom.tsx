import React from 'react'
import TopAppBarWrap from './TopAppBar'
import { AppHeaderProps } from './toolbarTypes'
import { LmComponentRender } from '../../CoreComponents'

// type HeaderComponents = {
//   [k: string]: any
// }

// const Components: HeaderComponents = {
//   toolbar_row: LmToolbarRow,
//   divider: LmDivider
// }

// function HeaderItem(blok: any, settings: GlobalStoryblok): JSX.Element {
//   if (typeof Components[blok.component] !== 'undefined') {
//     return React.createElement(Components[blok.component], {
//       key: blok._uid,
//       content: blok,
//       settings
//     })
//   }
//   return React.createElement(
//     () => (
//       <div style={{ color: 'red' }}>
//         The component {blok.component} has not been created yet.
//       </div>
//     ),
//     { key: blok._uid }
//   )
// }

function HeaderCustom(props: AppHeaderProps): JSX.Element {
  const content = props.settings || {}
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

export default HeaderCustom
