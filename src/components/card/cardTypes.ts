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
  // Programmatic callers also supply numeric limits; CMS declarations stay unchanged.
  options: Omit<
    StoryblokFields<CardListStoryblok>,
    'body' | 'column_gap' | 'description_max_character'
  > & { description_max_character?: string | number }
}

export type LmCardStandaloneProps = {
  content: CardStoryblok
}
