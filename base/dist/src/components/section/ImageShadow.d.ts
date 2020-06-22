declare type ImageShadowProps = {
    src: string;
    srcSet: string;
    afterLoad: FunctionStringCallback;
};
declare const ImageShadow: ({ afterLoad, ...rest }: ImageShadowProps) => JSX.Element | null;
export default ImageShadow;
