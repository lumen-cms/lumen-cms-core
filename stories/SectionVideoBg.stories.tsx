import { LmComponentRender as LmSectionVideo } from '../src/'
import * as React from 'react'
import { storyBackground, storyColumn, storyRow, storySectionVideoBg } from '../src/storybook/core/section'
import { storyHeadline } from '../src/storybook/core/various'
import { SectionVideoBgStoryblok } from '../src/typings/generated/components-schema'

export default {
  title: 'Section Video'
}

export const Basic = () => (
  <>
    <LmSectionVideo content={
      {
        ...storySectionVideoBg({
          options: {
            url_internal: {
              filename: 'https://a.storyblok.com/f/82895/x/a266d33556/union-klischee-leiterbahn.mp4'
            }
          }
        }),
        property: ['autoplay', 'muted', 'loop', 'playsinline'],
        body: [
          {
            ...storyRow(),
            background: [storyBackground({
              knob: 'Row',
              options: {
                classNames: {
                  values: ['text-white']
                }
              }
            })],
            body: [{
              ...storyColumn({ knob: 'Column', options: { width_general: 'auto', justify: 'flex-end' } }),
              background: [storyBackground({ knob: 'Column' })],
              body: [
                storyHeadline({ count: 1, knob: 'Column' }),
                storyHeadline({ count: 2, knob: 'Column' })
              ]
            }]
          }
        ]
      } as SectionVideoBgStoryblok
    } />
  </>
)


export const Playground = () => (
  <>
    <LmSectionVideo content={
      {
        ...storySectionVideoBg({
          options: {
            url: 'https://youtu.be/P1qaAGWUz5U'
          }
        }),
        body: [
          {
            ...storyRow(),
            background: [storyBackground({
              knob: 'Row',
              options: {
                classNames: {
                  values: ['text-white']
                }
              }
            })],
            body: [{
              ...storyColumn({ knob: 'Column', options: { width_general: 'auto', justify: 'flex-end' } }),
              background: [storyBackground({ knob: 'Column' })],
              body: [
                storyHeadline({ count: 1, knob: 'Column' }),
                storyHeadline({ count: 2, knob: 'Column' })
              ]
            }]
          }
        ]
      }
    } />
  </>
)
