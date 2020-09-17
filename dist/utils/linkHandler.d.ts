export interface LinkType {
    cached_url?: string;
    linktype?: string;
    nextHref?: string;
    id?: string;
    anchor?: string;
    url?: string;
    [k: string]: any;
}
interface LinkOptions {
    openExternal?: boolean;
}
export declare const homepageLinkHandler: () => string;
declare type LinkHandlerProps = {
    href?: string;
    target?: string;
    rel?: string;
    external?: boolean;
    download?: string;
    email?: string;
};
export declare const linkHandler: (link: LinkType, options: LinkOptions) => LinkHandlerProps;
export declare const getLinkAttrs: (link?: LinkType, options?: LinkOptions) => LinkHandlerProps;
export {};
