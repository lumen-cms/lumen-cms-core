import { TimelineItemStoryblok } from '../../typings/generated/components-schema';
export declare type LmTimelineItemProps = {
    content: TimelineItemStoryblok;
    iteration: number;
};
export declare function LmTimelineItem({ content, iteration }: LmTimelineItemProps): JSX.Element;
