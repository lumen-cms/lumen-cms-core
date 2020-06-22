import { ListWidgetStoryblok, NavListStoryblok } from '../../typings/generated/components-schema';
import { AppApiRequestPayload } from '../../typings/app';
declare type ListWidgetLinksProps = {
    items: AppApiRequestPayload['allStories'];
    options: NavListStoryblok;
    content: ListWidgetStoryblok;
};
declare function ListWidgetLinks({ items, options, content }: ListWidgetLinksProps): JSX.Element;
export default ListWidgetLinks;
