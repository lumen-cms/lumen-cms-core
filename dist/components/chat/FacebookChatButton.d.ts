/// <reference types="react" />
import { FacbookChatButtonProps } from './chatTypings';
declare global {
    interface Window {
        fbAsyncInit?: () => void;
        FB?: {
            init: (props: any) => void;
            CustomerChat: {
                hide: () => void;
                showDialog: () => void;
                hideDialog: () => void;
                show: (shouldShowDialog?: boolean) => void;
            };
            [k: string]: any;
        };
    }
}
export declare function FacebookChatButton({ content }: FacbookChatButtonProps): JSX.Element | null;
