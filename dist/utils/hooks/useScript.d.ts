export declare enum ScriptStatus {
    IDLE = "idle",
    LOADING = "loading",
    READY = "ready",
    ERROR = "error"
}
/**
 * Hook to load an external script. Returns true once the script has finished loading.
 *
 * @param url {string} url The external script to load
 * @param attributes {} attributes Script tag attributes
 * */
export default function useScript(url?: string, attributes?: {
    [k: string]: string;
}): [boolean, ScriptStatus];
