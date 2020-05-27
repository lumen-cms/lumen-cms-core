import { LmComponentRender as LmTabs } from '../src/'
import {
  HeadlineStoryblok,
  ParagraphStoryblok,
  TabsItemStoryblok,
  TabsStoryblok
} from '../src/typings/generated/components-schema'
import { storyTabs, storyTabsItem } from '../src/storybook/core/section'
import { storyHeadline, storyParagraph } from '../src/storybook/core/various'
import React from 'react'
import { loremIpsum } from 'lorem-ipsum'

const tabBodyItem = [{
  _uid: '123124',
  component: 'headline',
  text: loremIpsum({ units: 'sentences' })
}, {
  _uid: '2323',
  component: 'paragraph',
  text: loremIpsum({ units: 'sentences', count: 8 })
}] as (ParagraphStoryblok | HeadlineStoryblok)[]

const tabBody: TabsItemStoryblok[] = [{
  _uid: '1231',
  component: 'tabs_item',
  title: loremIpsum({ units: 'words', count: 2 }),
  body: tabBodyItem
}, {
  _uid: '123132',
  component: 'tabs_item',
  title: loremIpsum({ units: 'words', count: 2 }),
  body: [...tabBodyItem, {
    _uid: '1231123',
    component: 'paragraph',
    text: loremIpsum({ units: 'sentences', count: 10 })
  }] as (ParagraphStoryblok | HeadlineStoryblok)[]
}, {
  _uid: '53453453',
  component: 'tabs_item',
  title: loremIpsum({ units: 'words', count: 2 }),
  body: tabBodyItem
}, {
  _uid: '3adsfas',
  component: 'tabs_item',
  title: loremIpsum({ units: 'words', count: 2 }),
  body: tabBodyItem
}, {
  _uid: 'dgsda',
  component: 'tabs_item',
  title: loremIpsum({ units: 'words', count: 2 }),
  body: tabBodyItem
}, {
  _uid: 'jdhfg',
  component: 'tabs_item',
  title: loremIpsum({ units: 'words', count: 2 }),
  body: tabBodyItem
}]

const props: TabsStoryblok = {
  _uid: '123',
  component: 'tabs',
  body: tabBody
}

const withIcons = tabBody.map(i => ({ ...i, icon: { name: 'home' } })) as TabsItemStoryblok[]
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

export default {
  title: 'Tabs'
}

export const Basic = () => (
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
export const VerticalTabs = () => (
  <LmTabs content={vertical} />
)
export const DynamicHeight = () => (
  <div>
    <LmTabs content={{
      _uid: '123',
      component: 'tabs',
      dynamic_height: true,
      body: [{
        _uid: 'item-1',
        component: 'tabs_item',
        title: 'First',
        body: [{
          component: 'headline',
          _uid: 'head-1',
          text: 'First Headline'
        }, {
          component: 'headline',
          _uid: 'head-2',
          text: 'Second Headline'
        }] as HeadlineStoryblok[]
      }, {
        _uid: 'item-2',
        component: 'tabs_item',
        title: 'Second',
        body: tabBodyItem
      }, {
        _uid: 'item-3',
        component: 'tabs_item',
        title: 'Third',
        body: tabBodyItem
      }] as TabsItemStoryblok[]
    }} />
    <h3>Next content element.</h3>
  </div>
)
export const Playground = () => (
  <div className="p-5">
    <LmTabs content={{
      ...storyTabs(),
      body: [{
        ...storyTabsItem({ knob: 'Tab 1' }),
        body: [
          storyHeadline({ knob: 'Tab 1' }),
          storyParagraph({ knob: 'Tab 1' })
        ]
      }, {
        ...storyTabsItem({ knob: 'Tab 2' }),
        body: [
          storyHeadline({ knob: 'Tab 2' }),
          storyParagraph({ knob: 'Tab 2' })
        ]
      }, {
        ...storyTabsItem({ knob: 'Tab 3' }),
        body: [
          storyHeadline({ knob: 'Tab 3' }),
          storyParagraph({ knob: 'Tab 3' })
        ]
      }]
    }} />
  </div>
)

