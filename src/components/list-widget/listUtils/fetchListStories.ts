import { storyblokFetchStories } from './storyblokFetchApi'

export const fetchListStories = async (
  url: string, // this is stringified Stories for useSWR
  isPreview?: boolean
) => {
  const storiesParams = JSON.parse(url)
  const storyblokCacheVersion =
    window?.StoryblokCacheVersion as unknown as string
  const resData = await storyblokFetchStories({
    cv: storyblokCacheVersion,
    storiesParams,
    isPreview
  })
  return resData
}
