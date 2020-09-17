import React, { FunctionComponent } from 'react';
import { AppHeaderProps } from './toolbarTypes';
declare const TopAppBar: FunctionComponent<AppHeaderProps & {
    SystemBar?: React.ReactNode;
}>;
export default TopAppBar;
