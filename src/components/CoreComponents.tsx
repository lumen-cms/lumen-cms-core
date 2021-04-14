import React, { Attributes, ComponentClass, FC } from 'react'
import SbEditable from 'storyblok-react'
import { LmCoreComponents } from '@CONFIG'
import { useRouter } from 'next/router'
import { ComponentRenderFuncProps } from '../typings/app'

export function LmComponentRender<P>(
  props: ComponentRenderFuncProps
): JSX.Element {
  const { isPreview } = useRouter() || {}

  const { content, i, ...rest } = props

  if (typeof LmCoreComponents[content.component] !== 'undefined') {
    const CurrentElement = React.createElement(
      LmCoreComponents[content.component] as FC<P> | ComponentClass<P>,
      ({
        content,
        key:
          typeof i === 'number'
            ? `${content.component}_${content._uid || i}`
            : undefined,
        ...rest
      } as unknown) as Attributes & P
    )
    if (isPreview) {
      return <SbEditable content={content}>{CurrentElement}</SbEditable>
    }
    return CurrentElement
  }
  return (
    <div style={{ color: 'red' }} key={content?._uid || `${i}`}>
      The component {content.component || 'no name found'} has not been created
      yet.
    </div>
  )
}
