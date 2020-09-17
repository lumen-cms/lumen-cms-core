import { Story, StoryData } from 'storyblok-js-client';
import { GlobalStoryblok, PageStoryblok } from './generated/components-schema';
import { CategoryComponent, PageComponent, StaticcontainerComponent } from './generated/schema';
declare type ErrorProps = {
    type: 'not_supported' | 'page_not_found' | 'settings_not_found' | 'server_error';
    status: number;
    url: string;
};
export declare type AppApiRequestPayload = {
    page: Story;
    allStories: StoryData<PageComponent>[];
    settings: Story;
    locale?: string;
    allCategories: StoryData<CategoryComponent>[];
    allStaticContent: StoryData<StaticcontainerComponent>[];
    listWidgetData: {
        [k: string]: StoryData<PageComponent>[];
    } | null;
};
declare type SubProps = Pick<AppApiRequestPayload, 'allStaticContent' | 'locale' | 'allCategories' | 'listWidgetData'>;
export declare type AppPageProps = SubProps & {
    page?: PageStoryblok | null;
    settings?: GlobalStoryblok | null;
    error?: ErrorProps;
    query?: any;
    insideStoryblok?: boolean;
    [k: string]: any;
};
export declare type ComponentRenderFuncProps = {
    content?: any;
    _uid?: string;
    i?: number;
    [k: string]: any;
};
export {};
