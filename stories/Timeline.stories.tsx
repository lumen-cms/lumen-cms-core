import React from 'react'
import { LmComponentRender as LmTimeline } from '../src/'
import { storyTimeline, storyTimelineItem } from '../src/storybook/core/section'
import { randomIntFromInterval, storyAvatar, storyImageUrls } from '../src/storybook/core/various'

export default {
  title: 'Timeline'
}

export const Playground = () => (
  <>
    <LmTimeline content={{
      ...storyTimeline(),
      body: [{
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
          ...storyTimelineItem({ count: 2 }),
          icon: [storyAvatar({ count: 2, options: { icon: { name: 'home' } } })]
        },
        {
          ...storyTimelineItem({ count: 3 }),
          icon: [storyAvatar({
            count: 3,
            options: { image: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)] }
          })]
        }
      ]
    }} />
  </>
)
