export declare function getPreviewImageSource(image: string): string;
export declare function imageServiceNoWebp(image: string, option?: string): string;
export declare function getOriginalImageDimensions(src: string): {
    width: number;
    height: number;
};
export declare type GetImageFuncProps = {
    originalSource: string;
    width: number;
    height?: number;
    filter?: string;
    fitInColor?: string;
    smart?: boolean;
    focalPoint?: string;
};
export declare function getImageAttrs({ originalSource, width, height, filter, fitInColor, smart, focalPoint }: GetImageFuncProps): {
    src: string;
    srcSet: string;
};
export declare function getFocalPoint(src: string, focalPoint: string): string;
export default function imageService(image: string, option?: string, filter?: string): string;
