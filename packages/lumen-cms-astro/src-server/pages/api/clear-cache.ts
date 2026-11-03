import type { APIRoute } from 'astro'
import { clearFileCache } from 'lumen-cms-shared/core/utils/initial-props/fileCache'
import { LmStoryblokService } from 'lumen-cms-shared/core/utils/initial-props/StoryblokService'

export const ALL: APIRoute = () => {
 clearFileCache()
 LmStoryblokService.clearCaches()
 return Response.json({ message: 'Cache flushed' })
}
