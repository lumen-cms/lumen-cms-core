import * as React from 'react';
import { Story as StoryType } from '@storybook/react/types-6-0.d';
interface StorybookState {
    allTags: {
        value: string;
        label: string;
    }[];
}
export declare const setGlobalState: <StateKey_2 extends "allTags">(stateKey: StateKey_2, update: React.SetStateAction<StorybookState[StateKey_2]>) => void, useGlobalState: <StateKey extends "allTags">(stateKey: StateKey) => readonly [StorybookState[StateKey], (u: React.SetStateAction<StorybookState[StateKey]>) => void], getGlobalState: <StateKey_1 extends "allTags">(stateKey: StateKey_1) => StorybookState[StateKey_1];
declare const SetStoriesDecorator: (Story: StoryType) => JSX.Element;
export default SetStoriesDecorator;
