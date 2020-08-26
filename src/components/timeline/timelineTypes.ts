import {
  TimelineItemStoryblok,
  TimelineStoryblok
} from '../../typings/generated/components-schema'

export type LmTimelineItemProps = {
  content: TimelineItemStoryblok
  iteration: number
}
export type TimelineRowItemProps = {
  isLeft: boolean
  content: TimelineItemStoryblok
}

export type LmTimelineProps = { content: TimelineStoryblok }
