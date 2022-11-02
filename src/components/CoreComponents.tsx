import { Attributes, createElement } from 'react'
import { LmCoreComponents } from '@CONFIG'
import { ComponentRenderFuncProps } from '../typings/app'
import { useAppContext } from '@context/AppContext'
import SbEditable from 'storyblok-react'

export function LmComponentRender<P>(props: ComponentRenderFuncProps) {
  const { insideStoryblok } = useAppContext()
  const { content, i, ...rest } = props

  if (typeof LmCoreComponents[content.component] !== 'undefined') {
    const CurrentElement = createElement(LmCoreComponents[content.component], {
      content,
      key:
        typeof i === 'number'
          ? `${content.component}_${content._uid || i}`
          : undefined,
      ...rest
    } as unknown as Attributes & P)
    if (insideStoryblok) {
      // @ts-ignore
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
