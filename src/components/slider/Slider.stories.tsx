import { LmComponentRender as LmSlider } from '@LmComponentRender'
import { storySlider } from '../../storybook/core/various'
import { get3ColumnsSection } from '../../storybook/section'
import { SliderStoryblok } from '../../typings/generated/components-schema'

export default {
  title: 'Design/Surfaces/Carousel'
}

export const Playground = () => (
  <LmSlider
    content={{
      ...storySlider({
        options: {
          property: ['arrows_dark', 'pagination_dark']
        }
      }),
      body: [
        get3ColumnsSection({ count: 1 }),
        get3ColumnsSection({ count: 2 }),
        get3ColumnsSection({ count: 3 })
      ]
    }}
  />
)
export const PlaygroundDark = () => (
  <LmSlider
    content={
      {
        ...storySlider({
          options: {
            background_color: {
              rgba: 'black'
            },
            section_variant: 'dark'
          }
        }),
        section_variant: 'dark',
        body: [
          get3ColumnsSection({ count: 1 }),
          get3ColumnsSection({ count: 2 }),
          get3ColumnsSection({ count: 3 })
        ]
      } as SliderStoryblok
    }
  />
)
