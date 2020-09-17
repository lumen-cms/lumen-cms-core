/// <reference types="react" />
import { CardListStoryblok, ListsStoryblok, ListWidgetStoryblok, NavListStoryblok } from '../../typings/generated/components-schema';
import { AppApiRequestPayload } from '../../typings/app';
declare type ListWidgetContainerProps = {
    options: ListsStoryblok | CardListStoryblok | NavListStoryblok;
    content: ListWidgetStoryblok;
    items: AppApiRequestPayload['allStories'];
};
export declare function ListWidgetContainer(props: ListWidgetContainerProps): JSX.Element;
export {};
