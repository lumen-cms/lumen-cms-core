import React from 'react'
import { LmComponentRender } from '../CoreComponents'
import { SectionProps } from '../section/sectionTypes'

type LmSliderChildProps = { body: any[]; sectionVariant: any }

export function LmSliderChild({
  body,
  sectionVariant
}: LmSliderChildProps): JSX.Element {
  return (
    <div className="d-flex h-100 lm-slider__container flex-row justify-content-center">
      {body.map((item) => {
        if (item.component === 'section') {
          const newOpts: SectionProps = {
            ...item,
            presetVariant: sectionVariant || 'transparent'
          }
          return <LmComponentRender content={newOpts} key={newOpts._uid} />
        }
        return (
          <div key={`child_${item._uid}`} className="flex-grow-1">
            <LmComponentRender content={item} key={item._uid} />
          </div>
        )
      })}
    </div>
  )
}
