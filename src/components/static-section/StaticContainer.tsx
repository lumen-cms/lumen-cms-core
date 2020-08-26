import React from 'react'
import { LmComponentRender } from '../CoreComponents'
import { LmStaticContainerProps } from './staticTypes'

export function LmStaticContainer({
  content
}: LmStaticContainerProps): JSX.Element {
  return (
    <div className="lm-static-container">
      {(content.body || []).map((blok, i) =>
        LmComponentRender({ content: blok, i })
      )}
    </div>
  )
}
