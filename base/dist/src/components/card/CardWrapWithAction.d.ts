import { CSSProperties, FunctionComponent } from 'react';
import { CardListItemProps } from './cards';
interface CardWrapAction extends CardListItemProps {
    className: string;
    style: CSSProperties;
}
declare const CardWrapWithAction: FunctionComponent<CardWrapAction>;
export default CardWrapWithAction;
