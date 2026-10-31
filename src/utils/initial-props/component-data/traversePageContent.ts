import { AppPageProps } from '../../../typings/app'
import { SSR_CONFIG } from '../ssrConfig'
import { timed } from '../debugTiming'

type EnrichedBlock = {
  component: string
  elements?: EnrichedBlock[]
  body?: EnrichedBlock[]
  background?: EnrichedBlock[]
  container?: { content?: { body?: EnrichedBlock[] } }
  [key: string]: unknown
}

export const fetchComponentData = async (props: AppPageProps) => {
  // Loaders run concurrently so identical Storyblok requests share one fetch.
  const walkArray = async (elements: EnrichedBlock[]): Promise<void> => {
    await Promise.all(
      elements.map(async (item) => {
        const callback = SSR_CONFIG.ssrHooks.componentData[item.component]
        const children = [
          item.elements,
          item.body,
          item.container?.content?.body,
          item.background
        ].filter(Array.isArray)
        await Promise.all([
          typeof callback === 'function' &&
            timed(`component ${item.component}`, () =>
              callback(item, props)
            ).then((data) => {
              item[item.component + '_data'] = data
            }),
          ...children.map(walkArray)
        ])
      })
    )
  }
  if (Array.isArray(props)) {
    await walkArray(props as EnrichedBlock[])
  } else {
    await Promise.all(
      [props.page?.body, props.page?.right_body, props.settings?.footer]
        .filter(Array.isArray)
        .map(walkArray)
    )
  }
}
