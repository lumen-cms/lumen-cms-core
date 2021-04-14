import { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  let currentSlug = req.query.slug

  if (
    !currentSlug ||
    typeof currentSlug !== 'string' ||
    req.query.secret !== 'lm-qrxswkwkwkw'
  ) {
    return res.status(401).json({ message: 'Invalid token/slug' })
  }
  currentSlug = currentSlug.startsWith('/') ? currentSlug : `/${currentSlug}`
  const queryParams = { ...req.query }
  delete queryParams.slug

  // console.log('inside preview', queryParams, currentSlug)
  res.setPreviewData(queryParams)

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

  res.writeHead(307, { Location: currentSlug })

  res.end()
}
