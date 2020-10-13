import {
  CardListItemStoryblok,
  CardListStoryblok
} from '../../typings/generated/components-schema'

export type LmCardListProps = {
  content: CardListStoryblok
}
export type CardListItemProps = {
  content: CardListItemStoryblok
  inView: boolean
  options: Omit<
    CardListStoryblok,
    | 'body'
    | 'column_gap'
    | 'column_count'
    | 'column_count_phone'
    | 'column_count_tablet'
  >
}
