import { Theme } from '@material-ui/core/styles';
export declare const getCreatedStyles: (theme: Theme) => Record<"@global", import("@material-ui/styles").CSSProperties | import("@material-ui/styles").CreateCSSProperties<{}> | ((props: {}) => import("@material-ui/styles").CreateCSSProperties<{}>)>;
declare const useGlobalStyles: (props?: any) => Record<"@global", string>;
export default useGlobalStyles;
