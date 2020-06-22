import { AppApiRequestPayload, ComponentRenderProps, LinkRenderProps } from '../../../typings/app';
import React from 'react';
export declare type AppContextProps = Omit<AppApiRequestPayload, 'locale' | 'settings' | 'page' | 'allStories'> & {
    insideStoryblok?: boolean;
    ComponentRender: ComponentRenderProps;
    LinkRender?: LinkRenderProps;
    [k: string]: any;
};
export declare const AppContext: React.Context<AppContextProps>;
export declare const useAppContext: () => AppContextProps;
