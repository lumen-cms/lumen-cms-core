import { ImageListItemStoryblok } from '../../typings/generated/components-schema';
import { WithWindowDimensionsProps } from '../provider/context/WindowDimensionContext';
export declare type ImageListLightboxProps = {
    elements: ImageListItemStoryblok[];
    lightbox: string;
    setLightbox: Function;
    onImageClick: Function;
    dimensions: WithWindowDimensionsProps;
    className: string;
};
declare function Swipe(props: ImageListLightboxProps): JSX.Element;
export default Swipe;
