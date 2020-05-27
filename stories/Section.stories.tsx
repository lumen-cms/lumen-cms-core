import { LmComponentRender as LmSection } from '../src/'
import { BackgroundStoryblok, RowStoryblok, SectionStoryblok } from '../src/typings/generated/components-schema'
import * as React from 'react'
import { columns, columnsWithImage, row, rowWithImage } from '../src/storybook/section'
import { storyBackground, storyColumn, storyRow, storySection } from '../src/storybook/core/section'
import { storyButton, storyHeadline } from '../src/storybook/core/various'

const props: SectionStoryblok = {
  _uid: '34234',
  component: 'section',
  body: row
}

const backgroundItem = {
  _uid: '2131',
  component: 'background',
  image: 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
}
const background: SectionStoryblok = {
  ...props,
  background: [backgroundItem] as BackgroundStoryblok[]
}

const rowItem = {
  body: columns,
  _uid: '34241231',
  component: 'row'
}
const columnSection: SectionStoryblok = {
  _uid: '2234234',
  component: 'section',
  body: [rowItem] as RowStoryblok[]
}

const columnSectionWithImages: SectionStoryblok = {
  _uid: '12312dfd',
  component: 'section',
  body: [{
    body: columnsWithImage,
    _uid: '34241231',
    component: 'row'
  }] as RowStoryblok[]
}


export default {
  title: 'Section'
}

export const Basic = () => (
  <>
    <LmSection content={props} />
    <LmSection content={{ ...columnSection, variant: 'dark' }} />
    <LmSection content={{ ...columnSection, variant: 'primary' }} />
    <LmSection content={{ ...columnSection, variant: 'secondary' }} />
    <LmSection content={{ ...columnSection, variant: 'light' }} />
    <LmSection content={{ ...columnSection, variant: 'dark_text' }} />
    <LmSection content={{ ...columnSection, variant: 'light_text' }} />
  </>
)
export const BasicWithBackground = () => (
  <>
    <LmSection content={{
      ...background,
      property: ['is_full_height'],
      background_style: 'fixed_image',
      variant: 'light_text'
    }} />
    <h2>&nbsp;</h2>
    <LmSection content={{
      ...background,
      property: ['is_full_height'],
      background: [{
        background_color: {
          rgba: 'rgba(0,0,0,0.2)'
        },
        border_color: {
          rgba: 'red'
        },
        border_size: 3,
        border_radius: '24px 4px',
        elevation: 12
      }] as BackgroundStoryblok[]
    }} />
    <h2>&nbsp;</h2>
    <LmSection content={{ ...background, background_style: 'fixed_cover' }} />
    <LmSection content={{
      ...background,
      background: [{
        background_color: {
          rgba: 'rgba(0,0,0,0.2)'
        },
        border_color: {
          rgba: 'rgba(0,0,0,1)'
        },
        border_size: 3,
        border_radius: '12px',
        border_style: 'dotted'
      }] as BackgroundStoryblok[]
    }} />
    <LmSection content={background} />
    <LmSection content={{
      ...background,
      background: [{
        background_color: {
          rgba: 'rgba(0,0,0,0.2)'
        },
        border_color: {
          rgba: 'rgba(0,0,0,1)'
        },
        border_size: 3,
        border_radius: '12px',
        border_style: 'dotted'
      }] as BackgroundStoryblok[]
    }} />
  </>
)
export const SectionWithRow = () => (
  <>
    <LmSection content={{
      _uid: '123123',
      component: 'section',
      body: rowWithImage
    }} /> <br />
    <LmSection content={{
      _uid: '231123',
      component: 'section',
      body: rowWithImage
    }} /><br />
    <LmSection content={{
      _uid: '123123',
      component: 'section',
      body: rowWithImage
    }} />
  </>
)
export const SectionWithBackgroundImage = () => (
  <>
    <LmSection content={columnSectionWithImages} />
  </>
)
export const SectionAlignments = () => (
  <>
    <h1>Justify</h1>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'secondary',
      body: [{ ...rowItem, justify: 'flex-start' }] as RowStoryblok[]
    }} />
    <h2>end</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'dark',
      body: [{ ...rowItem, justify: 'flex-end' }] as RowStoryblok[]
    }} />
    <h2>space between</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'primary',
      body: [{ ...rowItem, justify: 'space-between' }] as RowStoryblok[]
    }} />
    <h2>space evenly</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'primary',
      body: [{ ...rowItem, justify: 'space-evenly' }] as RowStoryblok[]
    }} />
    <h2>space around</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'secondary',
      body: [{ ...rowItem, justify: 'space-around' }] as RowStoryblok[]
    }} />
    <h1>Alignment</h1>
    <h2>start</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'dark',
      body: [{ ...rowItem, align_content: 'flex-start' }] as RowStoryblok[]
    }} />
    <h2>end</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'primary',
      body: [{ ...rowItem, align_content: 'flex-end' }] as RowStoryblok[]
    }} />
    <h2>center</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'secondary',
      body: [{ ...rowItem, align_content: 'center' }] as RowStoryblok[]
    }} />
    <h2>space between</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'dark',
      body: [{ ...rowItem, align_content: 'space-between' }] as RowStoryblok[]
    }} />
    <h2>space around</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'secondary',
      body: [{ ...rowItem, align_content: 'space-around' }] as RowStoryblok[]
    }} />
    <h2>stretch</h2>
    <LmSection content={{
      ...columnSection,
      property: ['is_full_height'],
      variant: 'primary',
      body: [{ ...rowItem, align_content: 'stretch' }] as RowStoryblok[]
    }} />
  </>
)
export const Playground = () => (
  <div>
    <LmSection content={
      {
        ...storySection(),
        presetVariant: 'dark',
        background: [storyBackground({
          knob: 'Section', options: {
            image: 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
          }
        })],
        body: [
          {
            ...storyRow({ options: { justify: 'center' } }),
            background: [storyBackground({ knob: 'Row' })],
            body: [{
              ...storyColumn({ knob: 'Column 1', options: { width_general: 'auto' } }),
              background: [storyBackground({ knob: 'Column 1' })],
              body: [
                storyHeadline({ count: 1, knob: 'Column 1' }),
                storyHeadline({ count: 2, knob: 'Column 1' }),
                storyButton({ knob: 'Column 1' })
              ]
            }, {
              ...storyColumn({ knob: 'Column 2', options: { width_general: 'auto' } }),
              background: [storyBackground({ knob: 'Column 2' })],
              body: [
                storyHeadline({ count: 1, knob: 'Column 2' }),
                storyHeadline({ count: 2, knob: 'Column 2' }),
                storyButton({ knob: 'Column 2' })
              ]
            }]
          }
        ]
      }
    } />
  </div>
)

