/// <reference types="node" />
import { IncomingMessage } from 'http';
declare const hasWebpSupport: (req?: IncomingMessage | undefined) => Promise<boolean>;
export default hasWebpSupport;
