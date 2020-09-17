import { ColumnStoryblok, RowStoryblok, SectionParallaxStoryblok, SectionStoryblok, SectionVideoBgStoryblok } from '../../typings/generated/components-schema';
export interface SectionProps extends SectionStoryblok {
    presetVariant?: SectionStoryblok['variant'];
}
export declare type LmSectionParallaxProps = {
    content: SectionParallaxStoryblok;
};
export declare type LmSectionVideoProps = {
    content: SectionVideoBgStoryblok;
};
export declare type LmGridRowProps = {
    content: RowStoryblok;
};
export declare type LmGridColumnProps = {
    content: ColumnStoryblok;
};
export declare type LmSectionProps = {
    content: SectionProps;
};
