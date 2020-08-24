import React, { useEffect } from 'react'
import useSWR from 'swr'
import { useInView } from 'react-intersection-observer'
import { useScript } from '../../utils/hooks/useScript'
import fetcher from '../../utils/fetcher'
import { InstagramPostStoryblok } from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

const security = process.env.NODE_ENV === 'production' ? 'https' : 'http'

export type LmInstagramPostProps = {
  content: InstagramPostStoryblok
}

export function LmInstagramPost({ content }: LmInstagramPostProps) {
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
  const scriptLoading = useScript(
    `${security}://platform.instagram.com/en_US/embeds.js`,
    true
  )
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const swr = useSWR(
    () => (scriptLoading.loaded && inView ? urlStr : null),
    fetcher
  )
  useEffect(() => {
    if (swr.data?.html) {
      window.instgrm.Embeds.process()
    }
  }, [swr.data?.html])

  return (
    <div
      ref={refIntersectionObserver}
      dangerouslySetInnerHTML={{ __html: swr.data?.html || '<div/>' }}
    />
  )
}
