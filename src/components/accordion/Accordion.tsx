import { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmAccordionProps } from './accordionTypes'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'

export default function LmAccordion({
  content
}: LmAccordionProps): React.JSX.Element {
  const [opened, setOpen] = useState<string>('')
  const advancedSx = getAdvancedSx({
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
          advancedSx={advancedSx}
        />
      ))}
    </div>
  )
}
