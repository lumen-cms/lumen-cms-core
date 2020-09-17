import { TimelineItemStoryblok, TimelineStoryblok } from '../../typings/generated/components-schema';
export declare type LmTimelineItemProps = {
    content: TimelineItemStoryblok;
    options: TimelineStoryblok;
    isMobile?: boolean;
    isLast?: boolean;
};
export declare type TimelineRowItemProps = {
    isLeft: boolean;
    content: TimelineItemStoryblok;
};
export declare type LmTimelineProps = {
    content: TimelineStoryblok;
};
