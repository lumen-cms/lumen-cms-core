/// <reference types="react" />
export declare type WithWindowDimensionsProps = {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};
export declare const defaultWindowsProvider: WithWindowDimensionsProps;
export declare const WindowDimensionsCtx: import("react").Context<WithWindowDimensionsProps>;
export declare const useWindowDimensions: () => WithWindowDimensionsProps;
