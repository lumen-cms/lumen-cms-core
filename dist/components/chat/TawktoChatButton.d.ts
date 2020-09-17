import { TawktoProps } from './chatTypings';
declare global {
    interface Window {
        Tawk_API?: {
            hideWidget: () => void;
            toggleVisibility: () => void;
            showWidget: () => void;
            isChatHidden: () => boolean;
            [k: string]: any;
        };
    }
}
export declare function TawktoChatButton({ content }: TawktoProps): null;
