import { CSSProperties } from 'react';
import { ButtonStoryblok } from '../../typings/generated/components-schema';
declare type IconCoreProps = {
    className?: string;
    iconUrl?: string;
    style?: CSSProperties;
    iconName?: string;
    buttonSize?: ButtonStoryblok['size'];
    onClick?: () => void;
};
declare function IconCore({ className, style, iconName, buttonSize, iconUrl, onClick }: IconCoreProps): JSX.Element;
export default IconCore;
