import { NextApiRequest, NextApiResponse } from 'next'

async function fetcher<JSON = any>(username: string): Promise<JSON> {
  // todo need to be changed to use API of instagram gql..
  const getterUrl = `https://www.instagram.com/${username}/?__a=1`
  console.log(getterUrl)
  const res = await fetch(getterUrl)
  return res.json()
}

export default async function instagram(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { account } = req.query
  if (typeof account === 'string') {
    const feed = await fetcher(account)
    console.log(feed)
    res.status(200).json({
      feed
    })
  } else {
    res.status(500).json({
      message: 'account name is not present'
    })
  }
}
