import { BackgroundStoryblok, SectionStoryblok } from '../../typings/generated/components-schema';
import { CSSProperties } from 'react';
export declare type UseBackgroundProps = {
    background?: BackgroundStoryblok;
    variant?: SectionStoryblok['variant'];
};
export declare type UseBackgroundPayload = {
    style?: CSSProperties;
    className?: string;
};
export default function useBackgroundBox(props: UseBackgroundProps): UseBackgroundPayload;
