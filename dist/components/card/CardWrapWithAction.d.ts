import { CSSProperties, FunctionComponent } from 'react';
import { CardListItemProps } from './cardTypes';
interface CardWrapAction extends CardListItemProps {
    className: string;
    style: CSSProperties;
}
declare const CardWrapWithAction: FunctionComponent<CardWrapAction>;
export default CardWrapWithAction;
