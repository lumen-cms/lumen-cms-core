/// <reference types="react" />
import { GlobalStoryblok, PageStoryblok } from '../../typings/generated/components-schema';
declare type AppSeoProps = {
    settings: GlobalStoryblok;
    page?: PageStoryblok | null;
    previewImage?: string;
};
declare function AppSeo({ settings, page, previewImage }: AppSeoProps): JSX.Element;
export default AppSeo;
