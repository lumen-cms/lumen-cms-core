import { NextApiRequest, NextApiResponse } from 'next'
import LmStoryblokService from '../../utils/StoryblokService'

export default function clearCache(_req: NextApiRequest, res: NextApiResponse) {
  LmStoryblokService.flushCache()

  res.status(200).json({
    message: 'Cache flushed'
  })

}