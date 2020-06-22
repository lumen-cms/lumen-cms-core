import { ListsStoryblok, ListWidgetStoryblok } from '../../typings/generated/components-schema';
import { AppApiRequestPayload } from '../../typings/app';
declare type ListWidgetListsProps = {
    items: AppApiRequestPayload['allStories'];
    options: ListsStoryblok;
    content: ListWidgetStoryblok;
};
declare function ListWidgetLists({ items, options }: ListWidgetListsProps): JSX.Element;
export default ListWidgetLists;
