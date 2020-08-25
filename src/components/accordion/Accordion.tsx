import React, { useState } from 'react'
import {
  AccordionItemStoryblok,
  AccordionStoryblok
} from '../../typings/generated/components-schema'
import { LmComponentRender } from '../CoreComponents'

export type LmAccordionProps = {
  content: AccordionStoryblok
}

export function LmAccordion({ content }: LmAccordionProps): JSX.Element {
  const [opened, setOpen] = useState<string>('')
  return (
    <div className="lm-accordion">
      {(content.body || []).map((blok: AccordionItemStoryblok, iteration) =>
        LmComponentRender({
          content: blok,
          options: content,
          opened,
          setOpen,
          iteration,
          i: iteration
        })
      )}
    </div>
  )
}
