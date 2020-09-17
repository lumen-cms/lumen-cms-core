import { CSSProperties } from 'react';
import { BackgroundStoryblok, SectionStoryblok } from '../../typings/generated/components-schema';
export declare type UseBackgroundProps = {
    background?: BackgroundStoryblok;
    variant?: SectionStoryblok['variant'];
};
export declare type UseBackgroundPayload = {
    style?: CSSProperties;
    className?: string;
};
export default function useBackgroundBox(props: UseBackgroundProps): UseBackgroundPayload;
