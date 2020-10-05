import { NextApiRequest, NextApiResponse } from 'next'

export default function clearCache(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'Cache flushed'
  })
}
