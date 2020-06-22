import { SectionStoryblok } from '../../typings/generated/components-schema';
export interface SectionProps extends SectionStoryblok {
    presetVariant?: SectionStoryblok['variant'];
}
export declare type LmSectionProps = {
    content: SectionProps;
};
export declare function LmSection({ content }: LmSectionProps): JSX.Element;
