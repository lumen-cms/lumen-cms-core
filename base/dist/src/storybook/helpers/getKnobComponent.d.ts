export declare const camelizeString: (text: string, separator?: string) => string;
declare const getKnobComponents: ({ componentName, options, knob, count }: {
    componentName: any;
    options?: any;
    knob?: string | undefined;
    count?: string | number | undefined;
}) => {
    component: any;
    _uid: string;
};
export default getKnobComponents;
