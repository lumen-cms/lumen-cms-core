import { LmComponentRender as LmTimeline } from '@LmComponentRender'
import { storyTimeline, storyTimelineItem } from '../storybook/core/section'
import { getSentences, storyAvatar } from '../storybook/core/various'
import { HeadlineStoryblok } from '../typings/generated/components-schema'
import { getStorybookImageOnIteration } from '../storybook/contentHelper'

// eslint-disable-next-line import/no-anonymous-default-export
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
              image: getStorybookImageOnIteration(3)
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
            text: getSentences()
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
