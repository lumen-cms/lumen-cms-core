import { CONFIG } from '@CONFIG'
import { ListStoriesData, LmListStoriesPayload } from '../listWidgetTypes'
import { resolveLookup } from '../../../utils/universal/storyblokParamsHelper'

const enrichRelations = (storyData: ListStoriesData[], rels: any[]) => {
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

export const fetchListStories = async (
  url: string,
  cv: number,
  page: number,
  searchText: string
) => {
  const storyblokApi = new URL('https://api.storyblok.com/v2/cdn/stories')
  storyblokApi.searchParams.append('cv', `${cv}`)
  storyblokApi.searchParams.append('token', CONFIG.publicToken)
  storyblokApi.searchParams.append('page', `${page}`)
  if (searchText) {
    storyblokApi.searchParams.append('search_term', searchText)
  }
  let input = storyblokApi.toString() + '&' + url
  let storyReq = await fetch(input)
  const data = await storyReq.json()
  const resData = {
    total: Number(storyReq.headers.get('total')),
    page: Number(storyReq.headers.get('page')),
    ...data
  } as LmListStoriesPayload
  enrichRelations(resData.stories, resData.rels || [])
  return resData
}
