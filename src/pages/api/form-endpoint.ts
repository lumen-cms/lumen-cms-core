import { NextApiRequest, NextApiResponse } from 'next'
import { corsMiddleware } from '../../utils/universal/serverHelper'

export default async function formEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsMiddleware(req, res)
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  if (body) {
    res.send({ statusMessage: 'ok, data received.', ...body })
  } else {
    res.status(404).send({ error: 'request body not found.' })
  }
}
