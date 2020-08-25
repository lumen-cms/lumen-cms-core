import React from 'react'
import { StaticContainerStoryblok } from '../../typings/generated/components-schema'
import { LmComponentRender } from '../CoreComponents'

export type LmStaticContainerProps = { content: StaticContainerStoryblok }

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
