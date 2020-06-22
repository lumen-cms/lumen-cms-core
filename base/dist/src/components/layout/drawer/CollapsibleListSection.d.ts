import { NavMenuStoryblok } from '../../../typings/generated/components-schema';
declare type CollapsibleListSectionProps = {
    content: NavMenuStoryblok;
};
export declare function CollapsibleListSection({ content }: CollapsibleListSectionProps): JSX.Element;
declare type DrawerContentRenderProps = {
    content: any;
    i?: number;
    [k: string]: any;
};
export declare function DrawerContentRender({ content, i }: DrawerContentRenderProps): JSX.Element | null;
export {};
