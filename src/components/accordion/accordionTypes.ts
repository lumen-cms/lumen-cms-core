import {
  AccordionItemStoryblok,
  AccordionStoryblok
} from '../../typings/generated/components-schema'

export type LmAccordionProps = {
  content: AccordionStoryblok
}

export type LmAccordionItemProps = {
  content: AccordionItemStoryblok
  options: AccordionStoryblok
  opened: string
  setOpen: () => void
  iteration: number
}
