import { TimelineItemStoryblok } from '../../typings/generated/components-schema';
export declare type TimelineRowItemProps = {
    isLeft: boolean;
    content: TimelineItemStoryblok;
};
export declare function TimelineRowItem({ isLeft, content }: TimelineRowItemProps): JSX.Element;
export default TimelineRowItem;
