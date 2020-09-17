import { CardListItemStoryblok, CardListStoryblok } from '../../typings/generated/components-schema';
export declare type LmCardListProps = {
    content: CardListStoryblok;
};
export declare type CardListItemProps = {
    content: CardListItemStoryblok;
    options: Omit<CardListStoryblok, 'body' | 'column_gap' | 'column_count' | 'column_count_phone' | 'column_count_tablet'>;
};
