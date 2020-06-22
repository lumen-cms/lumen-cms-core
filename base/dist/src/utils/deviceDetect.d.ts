/// <reference types="node" />
import { IncomingMessage } from 'http';
export declare type AppDevice = {
    device?: 'mobile' | 'tablet' | null;
    isMobile: boolean;
    isTablet: boolean;
    width: number;
    isDesktop: boolean;
};
declare const deviceDetect: (req?: IncomingMessage | undefined) => AppDevice;
export default deviceDetect;
