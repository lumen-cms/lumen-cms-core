import React from 'react'
import { SectionProps } from '../section/Section'
import { useAppContext } from '../provider/AppProvider'

type LmSliderChildProps = { body: any[], sectionVariant: any }

export function LmSliderChild({ body, sectionVariant }: LmSliderChildProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  return (
    <div className="d-flex h-100 lm-slider__container flex-row justify-content-center">
      {body.map((item, i) => {
        if (item.component === 'section') {
          let newOpts: SectionProps = {
            ...item,
            presetVariant: sectionVariant || 'transparent'
          }
          return ComponentRender({ content: newOpts, i })
        }
        return (
          <div key={`child_${item._uid}`} className="flex-grow-1">
            {ComponentRender({ content: item, i })}
          </div>
        )
      })}
    </div>
  )
}
