import { LmComponentRender as LmMenu } from '@LmComponentRender'
import {
  NavMenuItemStoryblok,
  NavMenuStoryblok,
  RowStoryblok
} from '../../typings/generated/components-schema'
import { columns } from '../../storybook/section'
import { storyMenu, storyMenuItem } from '../../storybook/core/various'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'

const props: NavMenuStoryblok = {
  _uid: '123',
  component: 'nav_menu',
  title: 'A very long Menu',
  body: [
    {
      label: 'First',
      _uid: '112',
      component: 'nav_menu_item'
    },
    {
      label: 'Second',
      _uid: '12312',
      component: 'nav_menu_item'
    }
  ] as NavMenuItemStoryblok[]
}

const columnSection: NavMenuStoryblok = {
  _uid: '2234234',
  component: 'nav_menu',
  title: 'A Mega Menu',
  body: [
    {
      body: columns,
      _uid: '34241231',
      component: 'row'
    }
  ] as RowStoryblok[]
}

export default {
  title: 'Design/Navigation/Menu'
}

export const Presets = () => (
  <StorybookPresetsContainer componentName="nav_menu" />
)

export const Basic = () => (
  <>
    <h3>Default:</h3>
    <LmMenu content={props} />
    <h3>Bottom Alignment</h3>

    <LmMenu
      content={{
        ...props,
        alignment: 'bottomStart',
        start_icon: { name: 'home' }
      }}
    />

    <h3>Bottom Alignment</h3>
    <div className="text-center">
      <LmMenu
        content={{
          ...props,
          alignment: 'bottomStart',
          start_icon: { name: 'home' }
        }}
      />
    </div>
    <h3>Bottom Right Alignment</h3>
    <div className="text-center">
      <LmMenu
        content={{ ...props, alignment: 'bottomEnd', border_radius: '0' }}
      />
    </div>
    <h3>Border Radius</h3>
    <div className="text-center">
      <LmMenu
        content={{
          ...props,
          alignment: 'bottomEnd',
          border_radius: '16px 0px'
        }}
      />
    </div>
  </>
)
export const MegaMenu = () => (
  <>
    <LmMenu
      content={{
        ...columnSection,
        alignment: 'bottomEnd',
        border_radius: '16px 0px'
      }}
    />
  </>
)
export const Playground = () => (
  <div className="text-center p-5">
    <LmMenu
      content={{
        ...storyMenu(),
        body: [
          storyMenuItem({ count: 1 }),
          storyMenuItem({ count: 2 }),
          storyMenuItem({ count: 3 }),
          storyMenuItem({ count: 4 }),
          storyMenuItem({ count: 5 }),
          storyMenuItem({ count: 6 })
        ]
      }}
    />
  </div>
)
