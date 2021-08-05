import { NextApiRequest, NextApiResponse } from 'next'
import { scrapeInstagramUser } from '../../../../utils/instagram/instagramHelpers'

// can get improved..

const instagram = async (req: NextApiRequest, res: NextApiResponse) => {
  const { account } = req.query
  if (typeof account === 'string') {
    const feed = await scrapeInstagramUser(account)
    // const userId = await fetchInstagramUserId(account)
    // const feed = await fetchInstagramList(userId)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    // const result = feed?.data?.user?.edge_owner_to_timeline_media?.edges
    res.status(200).json(feed || { found: 0 })
  } else {
    res.status(500).json({
      message: 'account name is not present'
    })
  }
}
export default instagram
