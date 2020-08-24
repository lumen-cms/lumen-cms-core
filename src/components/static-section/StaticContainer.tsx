import React from 'react'
import { StaticContainerStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'

export type LmStaticContainerProps = { content: StaticContainerStoryblok }

export function LmStaticContainer({
  content,
}: LmStaticContainerProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  return (
    <div className="lm-static-container">
      {(content.body || []).map((blok, i) =>
        ComponentRender({ content: blok, i })
      )}
    </div>
  )
}
