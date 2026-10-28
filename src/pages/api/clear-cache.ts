import { NextApiRequest, NextApiResponse } from 'next'
import { clearFileCache } from '../../utils/initial-props/fileCache'
import { LmStoryblokService } from '../../utils/initial-props/StoryblokService'

export default function clearCache(_req: NextApiRequest, res: NextApiResponse) {
  clearFileCache()
  LmStoryblokService.clearCaches()

  res.status(200).json({
    message: 'Cache flushed'
  })
}
