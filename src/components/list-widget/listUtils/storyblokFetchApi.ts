import { CONFIG } from '@CONFIG'
import { StoriesParams } from 'storyblok-js-client'
import { queryStringify } from '../../../utils/universal/paramsToQueryString'
import { LmListStoriesPayload } from '../listWidgetTypes'
import { enrichRelations } from './enrichRelations'

type StoryblokFetchApiProps = {
  cv?: number
  isPreview?: boolean
  storiesParams?: StoriesParams
}
export const storyblokFetchStories = async ({
  cv,
  isPreview,
  storiesParams
}: StoryblokFetchApiProps) => {
  const storyblokApi = new URL('https://api.storyblok.com/v2/cdn/stories')
  if (cv) {
    storyblokApi.searchParams.append('cv', `${cv}`)
  }
  if (isPreview) {
    storyblokApi.searchParams.append('version', 'draft')
  }
  storyblokApi.searchParams.append(
    'token',
    isPreview ? CONFIG.previewToken : CONFIG.publicToken
  )
  let input = storyblokApi.toString()
  if (storiesParams) {
    const additionalQuery = queryStringify(storiesParams)
    input += additionalQuery ? '&' + additionalQuery : ''
  }
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
