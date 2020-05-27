import * as React from 'react'
import { LmComponentRender as LmPage } from '../src/'
import { get3ColumnsSection } from '../src/storybook/section'
import {
  storyBackground,
  storyColumn,
  storyParallaxItem,
  storyRow,
  storySectionParallax
} from '../src/storybook/core/section'
import { storyHeadline } from '../src/storybook/core/various'

export default {
  title: 'Section Parallax'
}

export const Playground = () => (
  <LmPage content={{
    _uid: 'page',
    component: 'page',
    body: [{
      ...storySectionParallax(),
      body: [
        {
          ...storyRow({
            knob: 'Content Parallax',
            options: {
              justify: 'center',
              align_content: 'flex-end'
            }
          }),
          background: [storyBackground({
            knob: 'Content Parallax', options: {
              classNames: { values: ['text-center', 'text-white'] }
            }
          })],
          body: [{
            ...storyColumn({ knob: 'Content Parallax' }),
            body: [
              storyHeadline({ knob: 'Content Parallax', options: { typography: 'headline2' } })
            ]
          }]
        }

      ],
      elements: [
        storyParallaxItem({
          options: {
            image: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
          }
        })
      ]
    },
      get3ColumnsSection({ knob: '3 Column Section', count: 1 }),
      get3ColumnsSection({ knob: '3 Column Section', count: 2 }),
      get3ColumnsSection({ knob: '3 Column Section', count: 3 })
    ]
  }} />
)
