import { NextApiRequest, NextApiResponse } from 'next'

// can get improved..
// here is the "pk" user ID of an account
// https://www.instagram.com/web/search/topsearch/?query=studentsgoabroad

// https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={%22id%22:3086246170,%22first%22:10,%22after%22:null}
// https://github.com/will-t-harris/use-instagram-feed

const fetchUserId = async (username: string) => {
  const url = new URL(
    `https://www.instagram.com/web/search/topsearch/?query=${username}`
  )
  const list = await fetch(url.toString()).then((r) => r.json())
  const foundUser = list?.users?.find((i) => i.user.username === username)
  return foundUser?.user?.pk
}

async function fetcher<JSON = any>(username: string): Promise<JSON> {
  // todo need to be changed to use API of instagram gql..
  const getterUrl = `https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={"id":${username},"first":${12},"after":null}`

  // const getterUrl = `https://www.instagram.com/${username}/?__a=1`
  const res = await fetch(getterUrl)
  return res.json()
}

const instagram = async (req: NextApiRequest, res: NextApiResponse) => {
  const { account } = req.query
  if (typeof account === 'string') {
    const userId = await fetchUserId(account)
    const feed = await fetcher(userId)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    const result = feed?.data?.user?.edge_owner_to_timeline_media?.edges
    res.status(200).json(result || { found: 0 })
  } else {
    res.status(500).json({
      message: 'account name is not present'
    })
  }
}
export default instagram
