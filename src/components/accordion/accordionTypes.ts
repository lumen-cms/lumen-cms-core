import {
  AccordionItemStoryblok,
  AccordionStoryblok
} from '../../typings/generated/components-schema'
import type { AdvancedSx } from '../../utils/hooks/useStylesAdvanced'

export type LmAccordionProps = {
  content: AccordionStoryblok
}

export type LmAccordionItemProps = {
  content: AccordionItemStoryblok
  options: AccordionStoryblok
  opened: string
  setOpen: (s: string) => void
  iteration: number
  advancedSx?: AdvancedSx
}
