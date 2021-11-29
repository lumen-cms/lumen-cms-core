import { Meta, Story } from '@storybook/react'
import {
  HeadlineStoryblok,
  ParagraphStoryblok,
  TabsItemStoryblok,
  TabsStoryblok
} from '../typings/generated/components-schema'
import LmTabs from '../components/tabs/Tabs'
import { getComponentArgTypes } from '../storybook/configControls'
import { findFirstPreset } from '../storybook/findStorybookPresets'
import StorybookPresetsContainer from '../storybook/components/StorybookPresetsContainer'
import { LmTabsProps } from '../components/tabs/tabsTypes'

const COMPONENT_NAME = 'tabs'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Navigation/Tabs',
  component: LmTabs,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
} as Meta

const Template: Story<LmTabsProps['content']> = (args) => (
  <LmTabs content={args} />
)

const presetContent = findFirstPreset<LmTabsProps['content']>(COMPONENT_NAME)

export const Preset = () => (
  <StorybookPresetsContainer componentName={COMPONENT_NAME} />
)

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

const getBodyItem = (i: number) =>
  [
    {
      _uid: '123124',
      component: 'headline',
      text: `Tab ${i}`
    },
    {
      _uid: '123123',
      component: 'paragraph',
      text: `This is some content for the tab ${i}`
    }
  ] as (ParagraphStoryblok | HeadlineStoryblok)[]

const tabBody: TabsItemStoryblok[] = [
  {
    _uid: '1231',
    component: 'tabs_item',
    title: 'Tab Title 1',
    body: getBodyItem(1)
  },
  {
    _uid: '123132',
    component: 'tabs_item',
    title: 'Tab Title 2',
    body: getBodyItem(2)
  },
  {
    _uid: '53453453',
    component: 'tabs_item',
    title: 'Tab Title 3',
    body: getBodyItem(3)
  },
  {
    _uid: '3adsfas',
    component: 'tabs_item',
    title: 'Tab Title 4',
    body: getBodyItem(4)
  },
  {
    _uid: 'dgsda',
    component: 'tabs_item',
    title: 'Tab Title 5',
    body: getBodyItem(5)
  },
  {
    _uid: 'jdhfg',
    component: 'tabs_item',
    title: 'Tab Title 6',
    body: getBodyItem(6)
  }
]

const props: TabsStoryblok = {
  _uid: '123',
  component: 'tabs',
  body: tabBody
}

const withIcons = tabBody.map((i) => ({
  ...i,
  icon: { name: 'home' }
})) as TabsItemStoryblok[]
const icons: TabsStoryblok = {
  _uid: '123',
  component: 'tabs',
  body: withIcons
}

const vertical: TabsStoryblok = {
  _uid: '123',
  component: 'tabs',
  vertical_tabs: true,
  tabs_width: '3',
  content_width: '9',
  mobile_breakpoint: 'xs',
  body: withIcons
}

export const Variants = () => (
  <>
    <LmTabs content={props} />
    <LmTabs content={{ ...props, variant: 'scrollable' }} />
    <LmTabs content={{ ...props, variant: 'standard' }} />
    <LmTabs content={{ ...props, variant: 'standard', centered: true }} />
  </>
)
export const WithIcons = () => (
  <>
    <LmTabs content={icons} />
    <LmTabs content={{ ...icons, variant: 'scrollable' }} />
    <LmTabs content={{ ...icons, variant: 'standard' }} />
    <LmTabs content={{ ...icons, variant: 'standard', centered: true }} />
  </>
)
export const VerticalTabs = () => <LmTabs content={vertical} />

const dynamicProps: LmTabsProps['content'] = {
  _uid: '123',
  component: 'tabs',
  dynamic_height: true,
  body: [
    {
      _uid: 'item-2',
      component: 'tabs_item',
      title: 'Second',
      body: getBodyItem(2)
    },
    {
      _uid: 'item-1',
      component: 'tabs_item',
      title: 'First',
      body: [
        {
          component: 'headline',
          _uid: 'head-1',
          typography: 'headline1',
          text: 'First Headline'
        },
        {
          component: 'headline',
          _uid: 'head-2',
          typography: 'headline2',
          text: 'Second Headline'
        },
        {
          component: 'headline',
          typography: 'headline3',
          _uid: 'head-2',
          text: 'Second Headline'
        }
      ] as HeadlineStoryblok[]
    },

    {
      _uid: 'item-3',
      component: 'tabs_item',
      title: 'Third',
      body: getBodyItem(3)
    }
  ] as TabsItemStoryblok[]
}
export const DynamicHeight = () => (
  <div>
    <h3>Dynamic height:</h3>
    <LmTabs content={dynamicProps} />
    <h3>Next content element.</h3>
    <h3>Fixed height (default):</h3>
    <LmTabs content={{ ...dynamicProps, dynamic_height: false }} />
    <h3>Next content element.</h3>
  </div>
)
