import {
  NavMenuItemStoryblok,
  NavMenuStoryblok,
  RowStoryblok
} from '../../typings/generated/components-schema'
import { columns } from '../../storybook/section'
import { storyMenu, storyMenuItem } from '../../storybook/core/various'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import { LmMenu } from './NavMenu'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Navigation/Menu',
  component: LmMenu
}

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

export const CustomIcons = () => (
  <div>
    <div>
      <LmMenu
        content={{
          ...props,
          icon: {
            name: 'plus'
          },
          icon_collapse: {
            name: 'minus'
          }
        }}
      />
    </div>
    <div style={{ marginTop: 3 }}>
      <LmMenu
        content={{
          ...props,
          icon_custom: [
            {
              component: 'icon',
              _uid: '123213',
              icon_url:
                'https://a.storyblok.com/f/106896/x/3993a9addc/arrow_down.svg'
            }
          ],
          icon_collapse_custom: [
            {
              component: 'icon',
              _uid: '23423e4',
              icon_url:
                'https://a.storyblok.com/f/106896/x/94de40e2dc/arrow_up.svg'
            }
          ]
        }}
      />
    </div>
  </div>
)

export const Alignment = () => (
  <div>
    <LmMenu
      content={{
        ...props
      }}
      initialOpen
    />
    <div className="text-center">
      <LmMenu
        content={{
          ...props,
          _uid: 'randasdfas',
          alignment: 'bottomEnd',
          border_radius: '16px 0px'
        }}
        initialOpen
      />
    </div>
    <div className="text-right">
      <LmMenu
        content={{
          ...props,
          _uid: '23234',
          alignment: 'bottomStart',
          border_radius: '0px'
        }}
        initialOpen
      />
    </div>
    <div className="mt-5">
      <LmMenu
        content={{
          ...props,
          _uid: '123123',
          alignment: 'bottomEnd',
          outlined: true
        }}
        initialOpen
      />
    </div>
    <div className="text-center">
      <LmMenu
        content={{
          ...props,
          _uid: '1221123234',
          alignment: 'bottomStart',
          border_radius: '0px',
          outlined: true
        }}
        initialOpen
      />
    </div>
    <div className="text-right">
      <LmMenu
        content={{
          ...props,
          _uid: '45345',
          alignment: 'bottomStart',
          elevation: 1
        }}
        initialOpen
      />
    </div>
  </div>
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

export const MegaMenuOpened = () => (
  <div>
    <LmMenu
      content={{
        ...columnSection,
        alignment: 'bottomEnd',
        border_radius: '16px 0px'
      }}
      initialOpen
    />
  </div>
)

export const OnHover = () => (
  <div>
    <LmMenu
      content={{
        ...props,
        _uid: '45345',
        alignment: 'bottomStart',
        elevation: 4,
        open_on_hover: true
      }}
    />
  </div>
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
