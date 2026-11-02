import { createElement, type ComponentType } from 'react'
import { LmCoreComponents } from '../utils/config'
import {
  ComponentRenderFuncProps,
  ComponentRenderContent
} from '../typings/app'
import {
  StoryblokPreviewProvider,
  useStoryblokPreview
} from './provider/context/StoryblokPreviewContext'
import { StoryblokEditable } from './provider/StoryblokEditable'

const registryHooks = new Set([
  'lm_app_providers',
  'lm_link_render',
  'parallax_provider'
])

export function LmComponentRender<C extends ComponentRenderContent>(
  props: ComponentRenderFuncProps<C>
) {
  return (
    <StoryblokPreviewProvider>
      <ComponentRender {...props} />
    </StoryblokPreviewProvider>
  )
}

function ComponentRender<C extends ComponentRenderContent>(
  props: ComponentRenderFuncProps<C>
) {
  const insideStoryblok = useStoryblokPreview()
  const { content } = props
  const i = props.i

  if (
    !registryHooks.has(content.component) &&
    Object.hasOwn(LmCoreComponents, content.component) &&
    typeof LmCoreComponents[content.component] !== 'undefined'
  ) {
    // The keyed registry checks registration; content.component selects that same key.
    // TypeScript cannot retain that correlation through a dynamic indexed lookup.
    const Renderer = LmCoreComponents[content.component] as ComponentType<
      ComponentRenderFuncProps<C>
    >
    const rendererProps = { ...props }
    delete rendererProps.i
    const CurrentElement = createElement(Renderer, {
      ...rendererProps,
      key:
        typeof i === 'number'
          ? `${content.component}_${content._uid || i}`
          : undefined
    })
    if (insideStoryblok) {
      return (
        <StoryblokEditable content={content}>
          {CurrentElement}
        </StoryblokEditable>
      )
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
