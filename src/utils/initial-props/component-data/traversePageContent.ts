import {
  RowStoryblok,
  SectionStoryblok
} from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { SSR_CONFIG } from '@SSR_CONFIG'

export const fetchComponentData = async (
  props: AppPageProps | (RowStoryblok | SectionStoryblok)[]
) => {
  const walkArray = async (elements: any[]) => {
    for (const item of elements) {
      const callback = SSR_CONFIG.ssrHooks.componentData[item.component]
      if (typeof callback === 'function') {
        item[item.component + '_data'] = await callback(item, props)
        // listWidgets.push(item)
      } else if (Array.isArray(item.body)) {
        await walkArray(item.body)
      }
    }
  }
  if (Array.isArray(props)) {
    await walkArray(props)
  } else {
    if (props.page) {
      if (Array.isArray(props.page.body)) {
        await walkArray(props.page.body)
      }
      if (Array.isArray(props.page.right_body)) {
        await walkArray(props.page.right_body)
      }
    }
    if (props.settings?.footer && Array.isArray(props.settings.footer)) {
      await walkArray(props.settings.footer)
    }
  }
}
