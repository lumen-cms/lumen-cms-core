import { GlobalStoryblok, ToolbarRowStoryblok } from '../../../typings/generated/components-schema';
declare type ToolbarRowProps = {
    content: ToolbarRowStoryblok;
    settings: GlobalStoryblok;
};
declare function ToolbarRow({ content, settings }: ToolbarRowProps): JSX.Element;
export default ToolbarRow;
