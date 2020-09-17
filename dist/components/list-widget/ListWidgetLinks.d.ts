/// <reference types="react" />
import { ListWidgetStoryblok, NavListStoryblok } from '../../typings/generated/components-schema';
import { AppApiRequestPayload } from '../../typings/app';
declare type ListWidgetLinksProps = {
    items: AppApiRequestPayload['allStories'];
    options: NavListStoryblok;
    content: ListWidgetStoryblok;
};
export declare function ListWidgetLinks({ items, options, content }: ListWidgetLinksProps): JSX.Element;
export {};
