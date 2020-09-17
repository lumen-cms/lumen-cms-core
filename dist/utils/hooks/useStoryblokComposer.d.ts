import { AppPageProps } from '../../typings/app';
import { GlobalStoryblok, PageStoryblok } from '../../typings/generated/components-schema';
export declare function useStoryblokComposer({ page, settings }: Pick<AppPageProps, 'settings' | 'page'>): (PageStoryblok | GlobalStoryblok | null | undefined)[];
