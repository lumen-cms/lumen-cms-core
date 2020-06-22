export declare function getImagePromise({ src, srcSet }: {
    src: string;
    srcSet: string;
}): Promise<unknown>;
export declare function getImage({ src, srcSet, onReady, onError }: {
    src: string;
    srcSet: string;
    onReady?: Function;
    onError?: Function;
}): void;
