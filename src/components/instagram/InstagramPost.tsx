/* eslint-disable react/no-danger */
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { useInView } from 'react-intersection-observer'
import useScript from '@charlietango/use-script'
import fetcher from '../../utils/fetcher'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmInstagramPostProps } from './instagramTypes'

const security = process.env.NODE_ENV === 'production' ? 'https' : 'http'

declare global {
  interface Window {
    instgrm: any
  }
}

export default function LmInstagramPost({ content }: LmInstagramPostProps) {
  const url = new URL(`${security}://api.instagram.com/oembed`)
  url.searchParams.append('url', content.url)
  url.searchParams.append('omitscript', 'true')
  if (content.hide_caption) {
    url.searchParams.append('hidecaption', 'true')
  }
  if (content.max_width) {
    url.searchParams.append('maxwidth', `${content.max_width}`)
  }
  const urlStr = url.toString()
  const [ready] = useScript(
    `${security}://platform.instagram.com/en_US/embeds.js`
  )
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const swr = useSWR<{ html: string }>(
    () => (ready && inView ? urlStr : null),
    fetcher,
    { revalidateOnFocus: false }
  )
  const swrHtml = swr?.data?.html || ''
  useEffect(() => {
    if (swrHtml) {
      window.instgrm.Embeds.process()
    }
  }, [swrHtml])

  return (
    <div
      ref={refIntersectionObserver}
      dangerouslySetInnerHTML={{ __html: swrHtml || '<div/>' }}
    />
  )
}
