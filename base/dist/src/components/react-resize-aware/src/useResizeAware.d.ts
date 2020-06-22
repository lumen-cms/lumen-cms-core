declare const defaultReporter: (target?: HTMLElement | undefined) => {
    width: import("../../../typings/generated/schema").Maybe<number>;
    height: import("../../../typings/generated/schema").Maybe<number>;
};
export default function useResizeAware(reporter?: typeof defaultReporter): (JSX.Element | {
    width: import("../../../typings/generated/schema").Maybe<number>;
    height: import("../../../typings/generated/schema").Maybe<number>;
})[];
export {};
