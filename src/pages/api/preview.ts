import { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  const slug = (req.query.slug as string) || ''

  if (req.query.secret !== 'lm-qrxswkwkwkw') {
    return res.status(401).json({ message: 'Invalid token/slug' })
  }

  res.setPreviewData({})

  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie')
  res.setHeader(
    'Set-Cookie',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (cookies || []).map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None')
    )
  )
  res.redirect(`${slug.startsWith('/') ? slug : `/${slug}`}`)
}
