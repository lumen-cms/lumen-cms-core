import React, { useState } from 'react'
import {
  AccordionItemStoryblok,
  AccordionStoryblok,
} from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'

export type LmAccordionProps = {
  content: AccordionStoryblok
}

export function LmAccordion({ content }: LmAccordionProps): JSX.Element {
  const [opened, setOpen] = useState<string>('')
  const { ComponentRender } = useAppContext()
  // console.log(ctx)
  return (
    <div className="lm-accordion">
      {(content.body || []).map((blok: AccordionItemStoryblok, iteration) =>
        ComponentRender({
          content: blok,
          options: content,
          opened,
          setOpen,
          iteration,
          i: iteration,
        })
      )}
    </div>
  )
}
