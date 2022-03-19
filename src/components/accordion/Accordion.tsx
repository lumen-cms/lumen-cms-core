import React, { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmAccordionProps } from './accordionTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

export default function LmAccordion({
  content
}: LmAccordionProps): JSX.Element {
  const [opened, setOpen] = useState<string>('')
  const { classes } = useStylesAdvanced({
    props: content.styles
  })

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
          classes={classes}
        />
      ))}
    </div>
  )
}
