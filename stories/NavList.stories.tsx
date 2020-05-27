import { LmComponentRender as LmNavList } from '../src/'
import * as React from 'react'
import { storyNavItem, storyNavList } from '../src/storybook/core/various'
import { boolean } from '@storybook/addon-knobs'

export default {
  title: 'Nav List'
}

export const Playground = () => {
  const forceCollapse = boolean('Force Collapse simulate mobile', false)
  return (<LmNavList content={
      {
        ...storyNavList(),
        forceCollapse,
        body: [
          { ...storyNavItem({ count: 1 }), link: { cached_url: 'https://google.com', linktype: 'external' } },
          storyNavItem({ count: 2 }),
          storyNavItem({ count: 3 }),
          storyNavItem({ count: 4 }),
          storyNavItem({ count: 5 })
        ]
      }
    } />
  )
}


