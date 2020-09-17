import { FunctionComponent } from 'react';
import { GlobalStoryblok } from '../../typings/generated/components-schema';
declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        defaultContainerWidth: string | boolean;
        drawer: {
            left: string;
            right: string;
        };
        toolbar: {
            progressColor?: string;
            height: {
                mobile: number;
                landscape: number;
                desktop: number;
                custom?: number;
                systemBar: number;
            };
        };
        alternativeFont: {
            alt1: string;
            alt2: string;
            alt3: string;
            alt4: string;
        };
    }
    interface ThemeOptions {
        defaultContainerWidth?: string | boolean;
        drawer: {
            left: string;
            right: string;
        };
        toolbar: {
            progressColor?: string;
            height: {
                mobile: number;
                landscape: number;
                desktop: number;
                custom?: number;
                systemBar: number;
            };
        };
        alternativeFont?: {
            alt1?: string;
            alt2?: string;
            alt3?: string;
            alt4?: string;
        };
    }
}
declare const GlobalTheme: FunctionComponent<{
    settings: GlobalStoryblok;
    rightDrawerWidth?: number;
}>;
export default GlobalTheme;
