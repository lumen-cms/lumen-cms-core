declare type AppConfigProps = {
    href: string;
    defaultLocale: string;
    publicToken: string;
    previewToken: string;
    languages: string[];
    rootDirectory?: string;
    overwriteLocale?: string;
    suppressSlugLocale?: boolean;
    suppressSlugIncludeDefault?: boolean;
    overwriteDisableIndex?: boolean;
    GA?: string;
    TAWKTO?: string;
    prefetch: boolean;
    hostname?: string;
};
export declare const CONFIG: AppConfigProps;
export {};
