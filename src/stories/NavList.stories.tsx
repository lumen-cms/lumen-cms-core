import { LmComponentRender as LmNavList } from '@LmComponentRender'
import { boolean } from '@storybook/addon-knobs'
import { storyNavItem, storyNavList } from '../storybook/core/various'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Layout/Nav List'
}

export const Playground = () => {
  const forceCollapse = boolean('Force Collapse simulate mobile', false)
  return (
    <LmNavList
      content={{
        ...storyNavList(),
        forceCollapse,
        body: [
          {
            ...storyNavItem({ count: 1 }),
            link: { cached_url: 'https://google.com', linktype: 'external' }
          },
          storyNavItem({ count: 2 }),
          storyNavItem({ count: 3 }),
          storyNavItem({ count: 4 }),
          storyNavItem({ count: 5 })
        ]
      }}
    />
  )
}
