import React, { FunctionComponent } from 'react';
import { GlobalStoryblok } from '../../../typings/generated/components-schema';
export declare type AppHeaderProps = {
    settings: GlobalStoryblok;
};
declare const TopAppBar: FunctionComponent<AppHeaderProps & {
    SystemBar?: React.ReactNode;
}>;
export default TopAppBar;
