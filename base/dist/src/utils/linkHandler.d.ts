export interface LinkType {
    cached_url?: string;
    linktype?: string;
    nextHref?: string;
    [k: string]: any;
}
interface LinkOptions {
    openExternal?: boolean;
}
export declare const homepageLinkHandler: () => string;
export declare const internalLinkHandler: (url: string) => string;
declare type LinkHandlerProps = {
    href?: string;
    target?: string;
    rel?: string;
    external?: boolean;
};
export declare const linkHandler: (link: LinkType, options: LinkOptions) => LinkHandlerProps;
export declare const getLinkAttrs: (link?: LinkType, options?: LinkOptions) => LinkHandlerProps;
export {};
