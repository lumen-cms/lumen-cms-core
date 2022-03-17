import {
  AccordionItemStoryblok,
  AccordionStoryblok
} from '../../typings/generated/components-schema'
import { ClassNameMap } from '@mui/styles';

export type LmAccordionProps = {
  content: AccordionStoryblok
}

export type LmAccordionItemProps = {
  content: AccordionItemStoryblok
  options: AccordionStoryblok
  opened: string
  setOpen: (s: string) => void
  iteration: number
  classes: ClassNameMap<'advanced'>
}
