import { FunctionComponent } from 'react';
import { AppContextProps } from './context/AppContext';
declare const AppProvider: FunctionComponent<{
    content: AppContextProps;
}>;
export default AppProvider;
