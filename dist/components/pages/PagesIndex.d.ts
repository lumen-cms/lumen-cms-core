/// <reference types="react" />
import { AppPageProps } from '../../typings/app';
declare global {
    interface Window {
        gtag: any;
        instgrm: any;
    }
}
export declare type LmPagesIndexProps = AppPageProps & {};
export declare function LmPagesIndex(props: LmPagesIndexProps): JSX.Element;
