import { LmComponentRender as LmSectionVideo } from '@LmComponentRender'
import {
  storyBackground,
  storyColumn,
  storyRow,
  storySectionVideoBg
} from '../../storybook/core/section'
import { storyHeadline } from '../../storybook/core/various'
import { SectionVideoBgStoryblok } from '../../typings/generated/components-schema'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Layout/Section Video'
}

export const Presets = () => (
  <StorybookPresetsContainer componentName="section_video_bg" />
)

export const Basic = () => (
  <>
    <LmSectionVideo
      content={
        {
          ...storySectionVideoBg({
            options: {
              url_internal: {
                id: 123,
                name: 'union-klischee-leiterbahn',
                filename:
                  'https://a.storyblok.com/f/82895/x/a266d33556/union-klischee-leiterbahn.mp4'
              }
            }
          }),
          property: ['autoplay', 'muted', 'loop', 'playsinline'],
          body: [
            {
              ...storyRow(),
              background: [
                storyBackground({
                  knob: 'Row',
                  options: {
                    classNames: {
                      values: ['text-white']
                    }
                  }
                })
              ],
              body: [
                {
                  ...storyColumn({
                    knob: 'Column',
                    options: { width_general: 'auto', justify: 'flex-end' }
                  }),
                  background: [storyBackground({ knob: 'Column' })],
                  body: [
                    storyHeadline({ count: 1, knob: 'Column' }),
                    storyHeadline({ count: 2, knob: 'Column' })
                  ]
                }
              ]
            }
          ]
        } as SectionVideoBgStoryblok
      }
    />
  </>
)

export const Playground = () => (
  <>
    <LmSectionVideo
      content={{
        ...storySectionVideoBg({
          options: {
            url: 'https://youtu.be/P1qaAGWUz5U'
          }
        }),
        body: [
          {
            ...storyRow(),
            background: [
              storyBackground({
                knob: 'Row',
                options: {
                  classNames: {
                    values: ['text-white']
                  }
                }
              })
            ],
            body: [
              {
                ...storyColumn({
                  knob: 'Column',
                  options: { width_general: 'auto', justify: 'flex-end' }
                }),
                background: [storyBackground({ knob: 'Column' })],
                body: [
                  storyHeadline({ count: 1, knob: 'Column' }),
                  storyHeadline({ count: 2, knob: 'Column' })
                ]
              }
            ]
          }
        ]
      }}
    />
  </>
)
