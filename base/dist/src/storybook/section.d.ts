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
            width_general?: "auto" | "false" | "true" | "12" | "11" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | undefined;
            width_tablet?: "auto" | "false" | "true" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | undefined;
            width_phone?: "auto" | "false" | "true" | "4" | "3" | "2" | "1" | undefined;
            background?: any[] | undefined;
            justify?: "space-around" | "space-between" | "space-evenly" | "center" | "flex-end" | "flex-start" | undefined;
            align_content?: "space-around" | "space-between" | "stretch" | "center" | "flex-end" | "flex-start" | undefined;
            align_items?: "stretch" | "center" | "flex-end" | "flex-start" | "baseline" | undefined;
            _uid: string;
            component: "column";
        }[];
        background?: any[] | undefined;
        spacing?: "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2" | "1" | undefined;
        justify?: "space-around" | "space-between" | "space-evenly" | "center" | "flex-end" | "flex-start" | undefined;
        align_content?: "space-around" | "space-between" | "stretch" | "center" | "flex-end" | "flex-start" | undefined;
        align_items?: "stretch" | "center" | "flex-end" | "flex-start" | "baseline" | undefined;
        direction?: "column" | "column-reverse" | "row" | "row-reverse" | undefined;
        reverse_on_mobile?: boolean | undefined;
        reverse_on_tablet?: boolean | undefined;
        _uid: string;
        component: "row";
    }[];
    section_identifier?: string | undefined;
    variant?: "transparent" | "dark" | "light" | "primary" | "secondary" | "dark_text" | "light_text" | undefined;
    background?: any[] | undefined;
    property?: "is_full_height"[] | undefined;
    padding?: string | undefined;
    max_width?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    background_style?: "fixed_image" | "fixed_cover" | undefined;
    _uid: string;
    component: "section";
};
