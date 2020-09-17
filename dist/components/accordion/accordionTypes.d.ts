import { AccordionItemStoryblok, AccordionStoryblok } from '../../typings/generated/components-schema';
export declare type LmAccordionProps = {
    content: AccordionStoryblok;
};
export declare type LmAccordionItemProps = {
    content: AccordionItemStoryblok;
    options: AccordionStoryblok;
    opened: string;
    setOpen: Function;
    iteration: number;
};
