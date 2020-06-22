import { ListSearchAutocompleteStoryblok, ToolbarLogoStoryblok, ToolbarRowSectionStoryblok, ToolbarRowStoryblok } from '../../typings/generated/components-schema';
import { StorybookOptionProps } from '../core/storybook_typing';
export declare const storyToolbarRow: ({ options, knob, count }?: StorybookOptionProps & {
    options?: Partial<ToolbarRowStoryblok> | undefined;
}) => ToolbarRowStoryblok;
export declare const storyToolbarSection: ({ options, knob, count }: StorybookOptionProps & {
    options?: Partial<ToolbarRowSectionStoryblok> | undefined;
}) => ToolbarRowSectionStoryblok;
export declare const storyListSearchAutocomplete: ({ options, knob, count }?: {
    options?: Partial<ListSearchAutocompleteStoryblok> | undefined;
    knob?: string | undefined;
    count?: number | undefined;
}) => ListSearchAutocompleteStoryblok;
export declare const storyToolbarLogo: (_options?: Partial<ToolbarLogoStoryblok>, _knobs?: string | undefined) => ToolbarLogoStoryblok;
