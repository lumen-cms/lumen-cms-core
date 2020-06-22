/// <reference types="react" />
export interface State {
    leftNavigationDrawer: boolean;
    rightNavigationDrawer: boolean;
    searchParams: {
        searchText: string | undefined;
        categories: string[] | undefined;
    };
    locale: string;
    hasWebpSupport?: boolean;
}
declare const setGlobalState: <StateKey_2 extends "leftNavigationDrawer" | "rightNavigationDrawer" | "searchParams" | "locale" | "hasWebpSupport">(stateKey: StateKey_2, update: import("react").SetStateAction<State[StateKey_2]>) => void, useGlobalState: <StateKey extends "leftNavigationDrawer" | "rightNavigationDrawer" | "searchParams" | "locale" | "hasWebpSupport">(stateKey: StateKey) => readonly [State[StateKey], (u: import("react").SetStateAction<State[StateKey]>) => void], getGlobalState: <StateKey_1 extends "leftNavigationDrawer" | "rightNavigationDrawer" | "searchParams" | "locale" | "hasWebpSupport">(stateKey: StateKey_1) => State[StateKey_1];
export { useGlobalState, setGlobalState, getGlobalState };
