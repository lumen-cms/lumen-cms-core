import { PageItem } from '../../typings/generated/schema'
import { CONFIG } from '@CONFIG'

export const getAllStoriesOfProject = async (): Promise<PageItem[]> => {
  const stories: PageItem[] = await fetch(
    `https://cdn-api.lumen.media/api/all-story-paths?token=${
      CONFIG.publicToken
    }${CONFIG.rootDirectory ? '&locale=' + CONFIG.rootDirectory : ''}`
  ).then((r) => r.json())
  return stories
}
