import { FunctionComponent } from 'react';
import { GlobalStoryblok, PageStoryblok } from '../../typings/generated/components-schema';
declare const AppSetupProvider: FunctionComponent<{
    settings: GlobalStoryblok;
    page?: PageStoryblok | null;
}>;
export default AppSetupProvider;
