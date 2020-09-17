/// <reference types="react" />
import { AppApiRequestPayload } from '../../../typings/app';
export declare type AppContextProps = Omit<AppApiRequestPayload, 'locale' | 'settings' | 'page' | 'allStories'> & {
    insideStoryblok?: boolean;
    [k: string]: any;
};
export declare const AppContext: import("react").Context<AppContextProps>;
export declare const useAppContext: () => AppContextProps;
