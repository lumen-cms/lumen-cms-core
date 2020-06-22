import { CSSProperties } from 'react';
import { ButtonStoryblok } from '../../typings/generated/components-schema';
declare type IconCoreProps = {
    className?: string;
    iconUrl?: string;
    style?: CSSProperties;
    iconName?: string;
    buttonSize?: ButtonStoryblok['size'];
};
declare function IconCore({ className, style, iconName, buttonSize, iconUrl }: IconCoreProps): JSX.Element;
export default IconCore;
