import { FunctionComponent } from 'react';
import { AppPageProps, ComponentRenderProps, LinkRenderProps } from '../../typings/app';
declare type AppContainerProps = {
    content: AppPageProps;
    ComponentRender: ComponentRenderProps;
    LinkRender: LinkRenderProps;
};
export declare const AppContainer: FunctionComponent<AppContainerProps>;
export {};
