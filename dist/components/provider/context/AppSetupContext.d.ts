/// <reference types="react" />
import { DrawerProps } from '@material-ui/core/Drawer';
import { GlobalStoryblok, PageStoryblok } from '../../../typings/generated/components-schema';
export declare type AppSetupProps = {
    hasDrawer?: boolean;
    hasFeatureImage?: boolean | null;
    hasRightDrawer?: boolean | null;
    drawerVariant?: DrawerProps['variant'];
    drawerBelowToolbar?: boolean;
    hasScrollCollapse?: boolean;
    toolbarMainHeight?: string | number;
    drawerFullWidthMobile?: boolean;
    rightDrawerMediaBreakpoint?: PageStoryblok['mobile_breakpoint'];
    leftDrawerMediaBreakpoint?: GlobalStoryblok['mobile_nav_breakpoint'];
};
export declare const AppSetupContext: import("react").Context<AppSetupProps>;
export declare const useAppSetup: () => AppSetupProps;
