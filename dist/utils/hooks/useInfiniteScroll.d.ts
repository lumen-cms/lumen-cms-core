export declare function useInfiniteScroll(collection: any[], perPage?: number): {
    ref: (node?: Element | null | undefined) => void;
    data: any[];
    hasMore: boolean;
};
