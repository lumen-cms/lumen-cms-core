import { BackgroundStoryblok, SectionStoryblok } from '../../typings/generated/components-schema';
declare type BackgroundImageProps = {
    content: BackgroundStoryblok;
    backgroundStyle?: SectionStoryblok['background_style'];
};
declare function BackgroundImage({ content, backgroundStyle }: BackgroundImageProps): JSX.Element | null;
export default BackgroundImage;
