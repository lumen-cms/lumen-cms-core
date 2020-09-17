/// <reference types="react" />
import { BackgroundElementColorStoryblok, BackgroundElementGradientStoryblok, BackgroundElementItemStoryblok } from '../../typings/generated/components-schema';
declare type BackgroundElementsProps = {
    elements: (BackgroundElementColorStoryblok | BackgroundElementItemStoryblok | BackgroundElementGradientStoryblok)[];
};
declare function BackgroundElements({ elements }: BackgroundElementsProps): JSX.Element;
export default BackgroundElements;
