import { LmComponentRender as LmPage } from '../src/'
import {
  GlobalStoryblok,
  PageStoryblok,
  ToolbarRowSectionStoryblok,
  ToolbarRowStoryblok
} from '../src/typings/generated/components-schema'
import { darkSectionWithColumns, get3ColumnsSection } from '../src/storybook/section'
import React from 'react'
import { toggleRightNavigation } from '../src/utils/state/actions'
import { simpleSettings } from '../src/storybook/toolbar'
import Layout from '../src/components/layout/Layout'
import {
  storyListSearchAutocomplete,
  storyToolbarLogo,
  storyToolbarRow,
  storyToolbarSection
} from '../src/storybook/layout/toolbar'
import { boolean } from '@storybook/addon-knobs'
import { storyButton, storyHeadline, storyMenu, storyMenuItem, storyParagraph } from '../src/storybook/core/various'
import { CONFIG_STORYBOOK } from '../src/storybook/components/configStorybook'


const getPropsDrawer = (): PageStoryblok => ({
  _uid: '123',
  component: 'page',
  uuid: '231231',
  body: [
    get3ColumnsSection({
      count: 1,
      knob: 'Body Section 1'
    }),
    get3ColumnsSection({
      count: 2,
      knob: 'Body Section 1'
    })],
  right_body: [
    storyHeadline({ count: 1, knob: 'Right Drawer' }),
    storyHeadline({ count: 2, knob: 'Right Drawer' }),
    storyParagraph({ knob: 'Right Drawer' })]
})

const getToolbarSettings = () => {
  return [{
    ...storyToolbarRow({
      options: { is_system_bar: true, background_color: { rgba: 'rgba(0,0,0,0.3)' } },
      knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR
    }),
    body: [{
      ...storyToolbarSection({ knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
      body: [
        storyButton({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
        storyButton({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
        storyButton({ count: 3, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
        {
          ...storyMenu({ knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
          body: [
            storyMenuItem({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
            storyMenuItem({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
            storyMenuItem({ count: 3, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR })
          ]
        }
      ]
    }] as ToolbarRowSectionStoryblok[]
  }, {
    ...storyToolbarRow({ knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
    body: [{
      ...storyToolbarSection({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
      body: [
        storyToolbarLogo({ knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW })
      ]
    }, {
      ...storyToolbarSection({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
      body: [
        storyButton({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
        storyButton({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
        storyButton({ count: 3, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
        {
          ...storyMenu({ knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
          body: [
            storyMenuItem({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
            storyMenuItem({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
            storyMenuItem({ count: 3, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW })
          ]
        },
        storyListSearchAutocomplete({ knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW })
      ]
    }] as ToolbarRowSectionStoryblok[]
  }] as ToolbarRowStoryblok []
}

export default {
  title: 'Page'
}

export const Basic = () => (
  <LmPage content={{
    _uid: '123',
    component: 'page',
    body: [get3ColumnsSection({ knob: 'Body Section 1' })]
  }} />
)
export const WithDrawer = () => (
  <>
    <button onClick={() => toggleRightNavigation()}>
      open if mobile
    </button>
    <LmPage content={getPropsDrawer()} />
  </>
)
export const Playground = ({ settings }: { settings: GlobalStoryblok }) => {
  const show = boolean('Show System Bar', true, 'System Bar')
  const customSettingsSystemBar: GlobalStoryblok = {
    ...simpleSettings,
    multi_toolbar: getToolbarSettings(),
    footer: [darkSectionWithColumns]
  }
  if (!show) {
    customSettingsSystemBar.multi_toolbar && customSettingsSystemBar.multi_toolbar.shift()
  }
  return (
    <>
      <Layout settings={{
        ...settings,
        multi_toolbar: customSettingsSystemBar.multi_toolbar,
        footer: customSettingsSystemBar.footer

      }}>
        <LmPage content={getPropsDrawer()} />
      </Layout>
    </>
  )
}

