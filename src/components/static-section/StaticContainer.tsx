import { StaticContainerStoryblok } from '../../typings/generated/components-schema'
import * as React from 'react'
import { useAppContext } from '../provider/AppProvider'

export type LmStaticContainerProps = { content: StaticContainerStoryblok }

export function LmStaticContainer({ content }: LmStaticContainerProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  return (
    <div className="lm-static-container">
      {(content.body || []).map((blok, i) => ComponentRender({ content: blok, i }))}
    </div>
  )
}
