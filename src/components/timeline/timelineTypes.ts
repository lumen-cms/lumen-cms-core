import { TimelineItemStoryblok, TimelineStoryblok } from '../../typings/generated/components-schema'

export type LmTimelineItemProps = {
  content: TimelineItemStoryblok
  options: TimelineStoryblok
  isMobile?: boolean
  isLast?: boolean
}
export type TimelineRowItemProps = {
  isLeft: boolean
  content: TimelineItemStoryblok
}

export type LmTimelineProps = {
  content: TimelineStoryblok
}
