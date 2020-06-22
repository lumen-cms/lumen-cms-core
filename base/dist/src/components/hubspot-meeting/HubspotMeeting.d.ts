import { HubspotMeetingStoryblok } from '../../typings/generated/components-schema';
export declare type LmHubspotMeetingProps = {
    content: HubspotMeetingStoryblok;
    disableEmbed?: boolean;
};
export declare function LmHubspotMeeting({ content, disableEmbed }: LmHubspotMeetingProps): JSX.Element;
