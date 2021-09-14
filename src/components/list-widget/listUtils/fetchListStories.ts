import { storyblokFetchStories } from './storyblokFetchApi'

export const fetchListStories = async (
  url: string, // this is stringified Stories for useSWR
  cv: number,
  isPreview?: boolean
) => {
  const storiesParams = JSON.parse(url)
  const resData = await storyblokFetchStories({
    cv,
    storiesParams,
    isPreview
  })
  return resData
}
