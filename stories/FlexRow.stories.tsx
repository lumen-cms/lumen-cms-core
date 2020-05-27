import {  LmComponentRender as LmFlexRow } from '../src/'
import { FlexRowStoryblok, HeadlineStoryblok, IconStoryblok } from '../src/typings/generated/components-schema'
import * as React from 'react'
import { storyFlexRow } from '../src/storybook/core/section'
import { storyHeadline, storyIcon } from '../src/storybook/core/various'

const icon: IconStoryblok = {
  _uid: '232123',
  component: 'icon',
  name: {
    name: 'home'
  },
  size: 'large'
}

const headline: HeadlineStoryblok = {
  _uid: '12312',
  component: 'headline',
  text: 'Headline1',
  typography: 'headline4'
}

const props: FlexRowStoryblok = {
  _uid: '2we',
  component: 'flex_row',
  body: [icon, headline]
}

const props2: FlexRowStoryblok = {
  _uid: '223434',
  component: 'flex_row',
  body: [{ ...headline, _uid: '123123' }, headline]
}

const props3: FlexRowStoryblok = {
  _uid: '223434',
  component: 'flex_row',
  body: [icon, { ...headline, _uid: '123123' }, headline]
}


export default {
  title: 'Flex Row'
}

export const Basic = () => (
  <>
    <div style={{ width: '500px', height: '300px', backgroundColor: '#ccc' }}>
      <LmFlexRow content={props} />
      <LmFlexRow content={{ ...props2, justify: 'center' }} />
      <LmFlexRow content={{ ...props3, justify: 'space-between' }} />
      <LmFlexRow content={{ ...props3, justify: 'space-around' }} />
      <LmFlexRow content={{ ...props3, align_items: 'flex-start' }} />
    </div>
    <h3>Column variant</h3>
    <div style={{ width: '500px', height: '200px', backgroundColor: '#ccc' }}>
      <LmFlexRow content={{ ...props, column: true, justify: 'space-between', full_height: true }} />
    </div>
    <h3>Column variant centered</h3>
    <div style={{ width: '500px', height: '200px', backgroundColor: '#ccc' }}>
      <LmFlexRow
        content={{ ...props, column: true, align_items: 'center', justify: 'space-between', full_height: true }} />
    </div>
  </>
)

export const Playground = () => (
  <div className="bg-light m-5" style={{ height: '50vh' }}>
    <LmFlexRow content={{
      ...storyFlexRow({ options: { align_items: 'center' } }),
      body: [
        storyIcon({ options: { name: { name: 'double_arrow' } } }),
        storyHeadline()
      ]
    }} />
  </div>
)

