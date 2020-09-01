import React, { Attributes, ComponentClass, FC } from 'react'
import SbEditable from 'storyblok-react'
import { ComponentRenderFuncProps } from '../typings/app'
import { useAppContext } from './provider/context/AppContext'
import { LmCoreComponents } from '../utils/config'

export function LmComponentRender<P>(
  props: ComponentRenderFuncProps
): JSX.Element {
  const appContext = useAppContext()
  const insideStoryblok = appContext?.insideStoryblok
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
    if (insideStoryblok) {
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