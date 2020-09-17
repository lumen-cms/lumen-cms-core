/// <reference types="react" />
import { ImageListItemStoryblok } from '../../typings/generated/components-schema';
export declare type ImageListLightboxProps = {
    elements: ImageListItemStoryblok[];
    lightbox: string;
    setLightbox: Function;
    onImageClick: Function;
    className: string;
    width: number;
    height: number;
};
declare function Swipe(props: ImageListLightboxProps): JSX.Element;
export default Swipe;
