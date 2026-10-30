import { NextApiRequest, NextApiResponse } from 'next'
import { fetchTravel } from '../utils/travel'

export default async function travel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = req.query.slug as string
  const travel = await fetchTravel(slug)
  const found = Array.isArray(travel) && travel.length > 0
  res.status(found ? 200 : 404)
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(found ? travel[0] : { error: 'not-found' })
}
