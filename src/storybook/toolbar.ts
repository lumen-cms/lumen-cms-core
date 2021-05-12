import {
  ButtonStoryblok,
  GlobalStoryblok,
  ListSearchAutocompleteStoryblok,
  NavMenuItemStoryblok,
  NavMenuStoryblok,
  ToolbarLogoStoryblok,
  ToolbarRowSectionStoryblok,
  ToolbarRowStoryblok
} from '../typings/generated/components-schema'
import { darkSectionWithColumns } from './section'

export const companyLogos = [
  '//a.storyblok.com/f/69069/192x192/d3ba0e3858/logo-fav-lumen.png',
  '//a.storyblok.com/f/66717/672x160/db392f6ffa/logo-white.png',
  '//a.storyblok.com/f/73553/1500x300/24cdd8ad64/planet-training-logo-wide-white.png',
  '//a.storyblok.com/f/69529/1076x500/aeb2c104c2/etherhill_logo_white_001.png'
]

const menuItem: NavMenuStoryblok = {
  _uid: '1231231',
  component: 'nav_menu',
  border_radius: '0px',
  title: 'Menu',
  start_icon: {
    name: 'home'
  },
  body: [
    {
      _uid: '3243',
      component: 'nav_menu_item',
      label: 'First'
    },
    {
      _uid: '34234242',
      component: 'nav_menu_item',
      label: 'Second'
    }
  ] as NavMenuItemStoryblok[]
}

const nestedMenu: NavMenuStoryblok = {
  ...menuItem,
  _uid: '123ddw',
  title: 'Nested Menu',
  start_icon: {
    name: 'menu'
  },
  body: [
    {
      _uid: '3243',
      component: 'nav_menu_item',
      label: 'First'
    },
    {
      _uid: '34234242',
      component: 'nav_menu_item',
      label: 'Second'
    },
    { ...menuItem, start_icon: null }
  ] as (NavMenuItemStoryblok | NavMenuStoryblok)[]
}

const toolbarItems = [
  {
    _uid: '34433',
    component: 'list_search_autocomplete',
    placeholder: 'Search...',
    outlined: true,
    shape: 'square',
    not_found_label: 'We could not find any page..',
    mobile_breakpoint: 'lg'
  },
  {
    _uid: '123',
    component: 'button',
    label: 'Button'
  },
  {
    _uid: '12321',
    component: 'button',
    icon: {
      name: 'home'
    },
    label: 'Another Button'
  },
  menuItem,
  nestedMenu
] as (ListSearchAutocompleteStoryblok | ButtonStoryblok | NavMenuStoryblok)[]

export const simpleSettings: GlobalStoryblok = {
  _uid: '123',
  component: 'global',
  theme_base: 'base',
  website_title: 'Storybook Website Title',
  toolbar: toolbarItems
}

const multiToolbar = [
  {
    _uid: '23',
    component: 'toolbar_row',
    body: [
      {
        _uid: '2323',
        component: 'toolbar_row_section',
        body: [
          {
            _uid: '23231',
            component: 'toolbar_logo'
          }
        ] as ToolbarLogoStoryblok[]
      },
      {
        _uid: '123',
        component: 'toolbar_row_section',
        align_end: true,
        body: toolbarItems
      }
    ] as ToolbarRowSectionStoryblok[]
  }
] as ToolbarRowStoryblok[]

const multiToolbarWithSystemBar = [
  {
    _uid: 'q3e234',
    component: 'toolbar_row',
    is_system_bar: true,
    body: [
      {
        _uid: '123',
        component: 'toolbar_row_section',
        align_end: true,
        body: toolbarItems
      }
    ] as ToolbarRowSectionStoryblok[]
  },
  ...multiToolbar
] as ToolbarRowStoryblok[]

export const customSettings: GlobalStoryblok = {
  ...simpleSettings,
  multi_toolbar: multiToolbar,
  footer: [darkSectionWithColumns]
}

export const customSettingsWithDrawer: GlobalStoryblok = {
  ...customSettings,
  drawer_body: toolbarItems as GlobalStoryblok['drawer_body'], // get rid of typing issues
  drawer_class_names: { values: ['bg-primary'] }
}

export const customSettingsSystemBar: GlobalStoryblok = {
  ...simpleSettings,
  multi_toolbar: multiToolbarWithSystemBar,
  footer: [darkSectionWithColumns]
}
