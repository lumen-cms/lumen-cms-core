import type { StoryblokFields } from '../../typings/storyblok-extensions'
import {
  CardListItemStoryblok,
  CardListStoryblok,
  CardStoryblok
} from '../../typings/generated/components-schema'

export type LmCardListProps = {
  disablePagination?: boolean
  content: CardListStoryblok
}
export type CardListItemProps = {
  content: CardListItemStoryblok
  options: Omit<StoryblokFields<CardListStoryblok>, 'body' | 'column_gap'>
}

export type LmCardStandaloneProps = {
  content: CardStoryblok
}
