import { NextApiRequest, NextApiResponse } from 'next'
import { fetchTravels } from '../utils/travels'

const apiFetchTravels = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const travels = await fetchTravels()
    res.status(200)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.json(travels)
  } catch (e) {
    console.error(e)
  }
}
export default apiFetchTravels
