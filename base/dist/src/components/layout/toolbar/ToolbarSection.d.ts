import { GlobalStoryblok, ToolbarRowSectionStoryblok } from '../../../typings/generated/components-schema';
export declare type LmToolbarSectionProps = {
    content: ToolbarRowSectionStoryblok;
    settings: GlobalStoryblok;
};
export declare function LmToolbarSection({ settings, content }: LmToolbarSectionProps): JSX.Element;
