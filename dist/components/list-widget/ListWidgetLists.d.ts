/// <reference types="react" />
import { ListsStoryblok } from '../../typings/generated/components-schema';
import { AppApiRequestPayload } from '../../typings/app';
declare type ListWidgetListsProps = {
    items: AppApiRequestPayload['allStories'];
    options: ListsStoryblok;
};
declare function ListWidgetLists({ items, options }: ListWidgetListsProps): JSX.Element;
export default ListWidgetLists;
