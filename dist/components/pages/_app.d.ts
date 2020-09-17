/// <reference types="react" />
import { AppProps } from 'next/app';
import { AppPageProps } from '../../typings/app';
export declare type LmAppProps = AppProps<AppPageProps>;
export declare function LmApp({ Component, pageProps, router }: LmAppProps): JSX.Element;
