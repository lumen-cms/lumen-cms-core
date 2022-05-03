import {
  TimelineItemStoryblok,
  TimelineStoryblok
} from '../../typings/generated/components-schema'

export type LmTimelineItemProps = {
  content: TimelineItemStoryblok
  options: TimelineStoryblok
  isMobile?: boolean
  isLast?: boolean
  setObserver?: (target: Element, callbackFn?: () => void) => void
  onFinish?: () => void
}
export type TimelineRowItemProps = {
  isLeft: boolean
  content: TimelineItemStoryblok
}

export type LmTimelineProps = {
  content: TimelineStoryblok
}
