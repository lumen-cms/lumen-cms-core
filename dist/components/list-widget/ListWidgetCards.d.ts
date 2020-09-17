/// <reference types="react" />
import { CardListStoryblok, ListWidgetStoryblok } from '../../typings/generated/components-schema';
import { AppApiRequestPayload } from '../../typings/app';
declare type ListWidgetCardsProps = {
    content: ListWidgetStoryblok;
    items: AppApiRequestPayload['allStories'];
    options: CardListStoryblok;
};
export declare function ListWidgetCards({ items, content, options }: ListWidgetCardsProps): JSX.Element;
export {};
