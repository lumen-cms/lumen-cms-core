import React, { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmAccordionProps } from './accordionTypes'

export default function LmAccordion({
  content
}: LmAccordionProps): JSX.Element {
  const [opened, setOpen] = useState<string>('')
  return (
    <div className="lm-accordion">
      {(content.body || []).map((blok, iteration) => (
        <LmComponentRender
          content={blok}
          options={content}
          opened={opened}
          setOpen={setOpen}
          iteration={iteration}
          key={blok._uid}
        />
      ))}
    </div>
  )
}
