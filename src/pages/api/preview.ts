import { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  const slug = (req.query.slug as string) || ''

  if (req.query.secret !== 'lm-qrxswkwkwkw') {
    return res.status(401).json({ message: 'Invalid token/slug' })
  }

  res.setPreviewData({})

  // Set cookie to None, so it can be read in the Storyblok iframe
  // Next's preview helpers write Set-Cookie as an array.
  const cookies = res.getHeader('Set-Cookie') as string[]
  res.setHeader(
    'Set-Cookie',
    (cookies || []).map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None;Secure')
    )
  )
  const params = new URLSearchParams()
  Object.keys(req.query).forEach((key) => {
    if (!['secret', 'slug'].includes(key)) {
      // @ts-ignore
      params.append(key, req.query[key])
    }
  })
  res.redirect(`/${slug}?${params.toString()}`)
}
