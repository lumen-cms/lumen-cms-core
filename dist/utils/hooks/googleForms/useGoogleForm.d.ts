declare type StructuredFormFieldProps = {
    questionTypeCode: number;
    questionTypeName: {
        name: string;
    };
    questionTextValue: string;
    answerOptionsList: string[];
    answerSubmitIdValue: number;
    isRequired: boolean;
};
export declare type StructuredFormProps = {
    description: string;
    title: string;
    formId: string;
    fields: StructuredFormFieldProps[];
    formAction: string;
} | undefined;
export declare const GoogleFormFieldTypes: {
    0: {
        name: string;
    };
    1: {
        name: string;
    };
    2: {
        name: string;
    };
    3: {
        name: string;
    };
    4: {
        name: string;
    };
    9: {
        name: string;
    };
};
export declare function useGoogleForm(formUrl: string): {
    formStructure: StructuredFormProps;
};
export {};
