import { LmComponentRender as LmSlider } from '../src/'
import * as React from 'react'
import { storySlider } from '../src/storybook/core/various'
import { get3ColumnsSection } from '../src/storybook/section'

export default {
  title: 'Slider'
}

export const Playground = () => (
  <LmSlider content={{
    ...storySlider({
      options: {
        property: ['arrows_dark', 'pagination_dark']
      }
    }), body: [
      get3ColumnsSection({ count: 1 }),
      get3ColumnsSection({ count: 2 }),
      get3ColumnsSection({ count: 3 })
    ]
  }} />
)
export const PlaygroundDark = () => (
  <LmSlider content={{
    ...storySlider({
      options: {
        background_color: {
          rgba: 'black'
        },
        section_variant: 'dark'
      }
    }), body: [
      get3ColumnsSection({ count: 1 }),
      get3ColumnsSection({ count: 2 }),
      get3ColumnsSection({ count: 3 })
    ]
  }} />
)


