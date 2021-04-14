// here is the "pk" user ID of an account
// https://www.instagram.com/web/search/topsearch/?query=studentsgoabroad

// https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={%22id%22:3086246170,%22first%22:10,%22after%22:null}
// https://github.com/will-t-harris/use-instagram-feed

// const queryId = {
//   posts_for_tags: 17875800862117404,
//   user_following: 17874545323001329,
//   user_followers: 17851374694183129,
//   user_posts: 17888483320059182,
//   likes_on_posts: 17864450716183058,
//   comments_on_posts: 17852405266163336,
//   posts_on_feed: 17842794232208280,
//   feed_profile_suggestions: 17847560125201451,
//   post_suggestions: 17863787143139595
// }

type GetInstagramProps = {
  username?: string
  userId?: string
  token?: string
}
export const getInstagramApi = ({
  username,
  userId,
  token
}: GetInstagramProps) => {
  return {
    media: new URL(
      `https://graph.facebook.com/${
        userId || process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID
      }/media/?access_token=${
        token || process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN
      }`
    ).toString(),
    channel: new URL(
      `https://www.instagram.com/${username}/channel/?__a=1`
    ).toString()
  }
}

export const fetchInstagramUserId = async (username: string) => {
  const url = new URL(
    `https://www.instagram.com/web/search/topsearch/?query=${username}`
  )
  const list = await fetch(url.toString()).then((r) => r.json())
  const foundUser = list?.users?.find((i: any) => i.user.username === username)
  return foundUser?.user?.pk
}

export async function fetchInstagramList<JSON = any>(
  username: string
): Promise<JSON> {
  // username = 3086246170
  // todo need to be changed to use API of instagram gql..

  const getterUrl = new URL(
    `https://www.instagram.com/${username}/channel/?__a=1`
  ).toString()

  // const getterUrl = new URL(
  //   `https://www.instagram.com/graphql/query?query_id=${
  //     queryId.user_posts
  //   }&variables={"id":${username},"first":${12},"after":null}`
  // ).toString()
  console.log(getterUrl)

  // const getterUrl = `https://www.instagram.com/${username}/?__a=1`
  const res = await fetch(getterUrl, {
    // method: 'GET',
    // credentials: 'same-origin',
    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    //   'X-CSRF-Token':
    //     'csrftoken=QEKxzScyOjedNQcjxbfFjBbzcXasIQhf; rur=ASH; ig_nrcb=1; ig_did=7BF640D5-0A5F-4AE1-BD5A-7B3ED41C9AD9; mid=YEroewAEAAHiV2HBULNrCJFqvTCJ'
    // }
  })
  return res.json()
}
