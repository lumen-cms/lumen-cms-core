import { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  let currentSlug = req.query.slug

  if (
    !currentSlug ||
    typeof currentSlug !== 'string' ||
    req.query.secret !== 'lm-qrxswkwkwkw'
  ) {
    res.status(401).json({ message: 'Invalid token/slug' })
    res.end()
  } else {
    currentSlug = currentSlug.startsWith('/') ? currentSlug : `/${currentSlug}`
    const queryParams = { ...req.query }
    delete queryParams.slug

    console.log('inside preview', queryParams, currentSlug)
    res.setPreviewData(queryParams)
    //  const searchParams = new URLSearchParams()
    // Object.keys(queryParams).forEach((key) => {
    //   searchParams.append(key, queryParams[key] as string)
    // })
    // console.log('inside preview', queryParams, searchParams.toString())
    // res.writeHead(307, { Location: currentSlug })
    // res.writeHead(307, { Location: `${currentSlug}?${searchParams.toString()}` })

    // res.write(
    //   `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${currentSlug}" />
    //   <script>window.location.href = '${currentSlug}'</script>
    //   </head>`
    // )
    res.writeHead(307, { Location: currentSlug })

    res.end()
  }
}
