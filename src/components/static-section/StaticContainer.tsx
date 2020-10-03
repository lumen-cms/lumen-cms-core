import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmStaticContainerProps } from './staticTypes'

export function LmStaticContainer({
  content
}: LmStaticContainerProps): JSX.Element {
  return (
    <div className="lm-static-container">
      {(content.body || []).map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
