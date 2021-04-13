import { LmComponentRender as LmTimeline } from '@LmComponentRender'
import { loremIpsum } from 'lorem-ipsum'
import { storyTimeline, storyTimelineItem } from '../../storybook/core/section'
import {
  randomIntFromInterval,
  storyAvatar
} from '../../storybook/core/various'
import { storyImageUrls } from '../../storybook/core/sharedFunctions'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'

export default {
  title: 'Design/Layout/Timeline'
}

export const Playground = () => {
  const timelineContentProps = {
    ...storyTimeline(),
    body: [
      {
        ...storyTimelineItem({
          count: 1
        }),
        icon: [
          storyAvatar({
            count: 1,
            options: {
              icon: {
                name: 'airport'
              }
            }
          })
        ]
      },
      {
        ...storyTimelineItem({
          count: 2,
          options: {
            dot_variant: 'outlined'
          }
        }),
        icon: [storyAvatar({ count: 2, options: { icon: { name: 'home' } } })]
      },
      {
        ...storyTimelineItem({
          count: 3,
          options: {
            dot_variant: 'naked'
          }
        }),
        icon: [
          storyAvatar({
            count: 3,
            options: {
              image:
                storyImageUrls[
                  randomIntFromInterval(0, storyImageUrls.length - 1)
                ]
            }
          })
        ]
      },
      {
        ...storyTimelineItem({
          count: 4,
          options: {
            dot_variant: 'outlined'
          }
        }),
        opposite_body: [
          {
            component: 'headline',
            _uid: 'dfgsfd',
            typography: 'headline5',
            text: loremIpsum({ units: 'word' })
          } as HeadlineStoryblok
        ]
      },
      {
        ...storyTimelineItem({
          count: 5,
          options: {
            dot_color: 'primary'
          }
        })
      }
    ]
  }
  return (
    <>
      <LmTimeline content={timelineContentProps} />
    </>
  )
}
