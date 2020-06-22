import { StoriesParams } from 'storyblok-js-client';
import { AppPageProps } from '../typings/app';
declare class StoryblokServiceClass {
    private devMode;
    private token;
    private readonly previewToken;
    private client;
    private query;
    constructor();
    setToken(token: string): void;
    flushCache(): boolean;
    getCacheVersion(): number;
    getToken(): string;
    getSearch(slug: string, params: any): Promise<import("storyblok-js-client").StoryblokResult>;
    getDefaultParams(): StoriesParams;
    getAll(slug: string, params?: {}): Promise<any[]>;
    get(slug: string, params?: {}): Promise<import("storyblok-js-client").StoryblokResult>;
    setDevMode(): void;
    initEditor({ page, setPage, settings, setSettings }: {
        page?: AppPageProps['page'];
        setPage: Function;
        settings?: AppPageProps['settings'];
        setSettings: Function;
    }): void;
    insideVisualComposer(): boolean;
    setQuery(query: any): void;
    getQuery(param: any): any;
}
declare const StoryblokService: StoryblokServiceClass;
export default StoryblokService;
