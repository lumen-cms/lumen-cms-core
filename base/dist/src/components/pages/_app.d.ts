import { AppProps } from 'next/app';
import { AppPageProps, ComponentRenderProps, LinkRenderProps } from '../../typings/app';
export declare type LmAppProps = AppProps<AppPageProps> & {
    ComponentRender: ComponentRenderProps;
    LinkRender?: LinkRenderProps;
};
export declare function LmApp({ Component, pageProps, ComponentRender, LinkRender, router }: LmAppProps): JSX.Element;
