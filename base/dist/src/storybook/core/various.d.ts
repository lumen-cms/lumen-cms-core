import { StorybookOptionProps } from './storybook_typing';
import { AccordionItemStoryblok, AccordionStoryblok, AvatarStoryblok, ButtonListStoryblok, ButtonStoryblok, DateHeadlineStoryblok, DividerStoryblok, HeadlineStoryblok, HtmlStoryblok, HubspotMeetingStoryblok, IconStoryblok, IframeStoryblok, ImageStoryblok, MotionStoryblok, NavItemStoryblok, NavListStoryblok, NavMenuItemStoryblok, NavMenuStoryblok, PlayerStoryblok, RichTextEditorStoryblok, SliderStoryblok, TableStoryblok } from '../../typings/generated/components-schema';
export declare const getUid: () => string;
export declare function randomIntFromInterval(min: number, max: number): number;
export declare const storyImageUrls: string[];
export declare const storyImageOptions: () => {
    'Select or drop a public url': undefined;
};
export declare const allImageOptions: {
    'Select or drop a public url': undefined;
};
export declare const getLabel: (words?: number) => string;
export declare const getSentences: (count?: number) => string;
export declare const getParagraphs: (paragraphs?: number) => string;
export declare const getOptions: (object: any) => {};
export declare const getRandomImage: () => string;
export declare const storyButton: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<ButtonStoryblok> | undefined;
}) => {
    component: any;
    _uid: string;
};
export declare const storyMenu: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<NavMenuStoryblok> | undefined;
}) => NavMenuStoryblok;
export declare const storyMenuItem: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<NavMenuItemStoryblok> | undefined;
}) => NavMenuItemStoryblok;
export declare const storyHeadline: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<HeadlineStoryblok> | undefined;
}) => HeadlineStoryblok;
export declare const storyDateHeadline: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<DateHeadlineStoryblok> | undefined;
}) => DateHeadlineStoryblok;
export declare const storyParagraph: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<RichTextEditorStoryblok> | undefined;
}) => RichTextEditorStoryblok;
export declare const storyAccordion: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<AccordionStoryblok> | undefined;
}) => AccordionStoryblok;
export declare const storyAccordionItem: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<AccordionItemStoryblok> | undefined;
}) => AccordionItemStoryblok;
export declare const storyButtonList: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<ButtonListStoryblok> | undefined;
}) => ButtonListStoryblok;
export declare const storyDivider: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<DividerStoryblok> | undefined;
}) => DividerStoryblok;
export declare const storyIcon: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<IconStoryblok> | undefined;
}) => IconStoryblok;
export declare const storyHtml: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<HtmlStoryblok> | undefined;
}) => HtmlStoryblok;
export declare const storyIframe: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<IframeStoryblok> | undefined;
}) => IframeStoryblok;
export declare const storyImage: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<ImageStoryblok> | undefined;
}) => ImageStoryblok;
export declare const storyAvatar: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<AvatarStoryblok> | undefined;
}) => AvatarStoryblok;
export declare const storyTable: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<TableStoryblok> | undefined;
}) => TableStoryblok;
export declare const storySlider: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<SliderStoryblok> | undefined;
}) => SliderStoryblok;
export declare const storyHubspotMeeting: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<HubspotMeetingStoryblok> | undefined;
}) => HubspotMeetingStoryblok;
export declare const storyNavList: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<NavListStoryblok> | undefined;
}) => NavListStoryblok;
export declare const storyNavItem: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<NavItemStoryblok> | undefined;
}) => NavItemStoryblok;
export declare const storyMotion: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<MotionStoryblok> | undefined;
}) => MotionStoryblok;
export declare const storyPlayer: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<PlayerStoryblok> | undefined;
}) => PlayerStoryblok;
