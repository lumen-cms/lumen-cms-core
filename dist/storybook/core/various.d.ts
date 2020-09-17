import { AccordionItemStoryblok, AccordionStoryblok, AvatarStoryblok, ButtonListStoryblok, ButtonStoryblok, DateHeadlineStoryblok, DialogStoryblok, DividerStoryblok, FormStoryblok, HeadlineStoryblok, HtmlStoryblok, HubspotMeetingStoryblok, IconStoryblok, IframeStoryblok, ImageStoryblok, InstagramListStoryblok, InstagramPostStoryblok, MotionStoryblok, NavItemStoryblok, NavListStoryblok, NavMenuItemStoryblok, NavMenuStoryblok, PlayerStoryblok, RichTextEditorStoryblok, SliderStoryblok, SnackbarStoryblok, TableStoryblok } from '../../typings/generated/components-schema';
import { StorybookOptionProps } from './storybook_typing';
export declare function randomIntFromInterval(min: number, max: number): number;
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
export declare const storyForm: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<FormStoryblok> | undefined;
}) => FormStoryblok;
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
export declare const storyDialog: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<DialogStoryblok> | undefined;
}) => DialogStoryblok;
export declare const storyInstagramPost: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<InstagramPostStoryblok> | undefined;
}) => InstagramPostStoryblok;
export declare const storyInstagramList: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<InstagramListStoryblok> | undefined;
}) => InstagramListStoryblok;
export declare const storySnackbar: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<SnackbarStoryblok> | undefined;
}) => SnackbarStoryblok;
