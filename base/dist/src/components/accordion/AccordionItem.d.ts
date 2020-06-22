import { AccordionItemStoryblok, AccordionStoryblok } from '../../typings/generated/components-schema';
declare type LmAccordionItemProps = {
    content: AccordionItemStoryblok;
    options: AccordionStoryblok;
    opened: string;
    setOpen: Function;
    iteration: number;
};
export declare function LmAccordionItem({ content, options, setOpen, opened, iteration }: LmAccordionItemProps): JSX.Element;
export {};
