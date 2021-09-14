import { ListStoriesData } from '../listWidgetTypes'
import { resolveLookup } from '../../../utils/universal/storyblokParamsHelper'

export const enrichRelations = (storyData: ListStoriesData[], rels: any[]) => {
  if (rels.length) {
    storyData.forEach((data) => {
      const lookupColumn = resolveLookup[data.content.component]
      const contentElement = data.content[lookupColumn]
      if (Array.isArray(contentElement) && contentElement.length) {
        data.content[lookupColumn] = contentElement
          .map((uuid) => {
            return rels.find((i) => i.uuid === uuid)
          })
          .filter((i) => i)
        // const componentType = data.content[lookupColumn]
      } else if (contentElement) {
        data.content[lookupColumn] = rels.find((i) => i.uuid === contentElement)
      }
    })
  }
}
