import { NextApiRequest, NextApiResponse } from 'next'

export default async function exitPreview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug = '' } = req.query

  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData()

  // set the cookies to None
  // Next's preview helpers write Set-Cookie as an array.
  const cookies = res.getHeader('Set-Cookie') as string[]
  res.setHeader(
    'Set-Cookie',
    cookies.map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
    )
  )

  // Redirect the user back to the index page.
  res.redirect(`/${slug}`)
}
