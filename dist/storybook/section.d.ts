import { ColumnStoryblok, RowStoryblok, SectionStoryblok } from '../typings/generated/components-schema';
export declare const columns: ColumnStoryblok[];
export declare const columnsWithImage: ColumnStoryblok[];
export declare const row: RowStoryblok[];
export declare const rowWithColumns: RowStoryblok[];
export declare const darkSectionWithColumns: SectionStoryblok;
export declare const rowWithImage: RowStoryblok[];
export declare const get3ColumnsSection: ({ count, knob }?: {
    count?: number | undefined;
    knob?: string | undefined;
}) => {
    body: {
        body: {
            body: {
                component: any;
                _uid: string;
            }[];
            width_general?: "true" | "false" | "12" | "11" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | "auto" | undefined;
            width_tablet?: "true" | "false" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | "auto" | undefined;
            width_phone?: "true" | "false" | "4" | "3" | "2" | "1" | "auto" | undefined;
            background?: any[] | undefined;
            justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-evenly" | "space-around" | undefined;
            align_content?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "stretch" | undefined;
            align_items?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline" | undefined;
            _uid: string;
            component: "column";
        }[];
        background?: any[] | undefined;
        spacing?: "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | undefined;
        justify?: "center" | "flex-start" | "flex-end" | "space-between" | "space-evenly" | "space-around" | undefined;
        align_content?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "stretch" | undefined;
        align_items?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline" | undefined;
        direction?: "column" | "row" | "row-reverse" | "column-reverse" | undefined;
        reverse_on_mobile?: boolean | undefined;
        reverse_on_tablet?: boolean | undefined;
        _uid: string;
        component: "row";
    }[];
    section_identifier?: string | undefined;
    variant?: "primary" | "secondary" | "dark" | "light" | "dark_text" | "light_text" | "transparent" | undefined;
    background?: any[] | undefined;
    property?: "is_full_height"[] | undefined;
    padding?: string | undefined;
    max_width?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    background_style?: "fixed_image" | "fixed_cover" | undefined;
    _uid: string;
    component: "section";
};
