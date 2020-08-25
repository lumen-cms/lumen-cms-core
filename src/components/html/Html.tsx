import React, { useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { HtmlStoryblok } from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

export type LmHtmlProps = { content: HtmlStoryblok }

export function LmHtml({ content }: LmHtmlProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const htmlContent = useMemo<string>(() => {
    if (content.lazy_load) {
      if (inView) {
        return content.body || ''
      }
      return ''
    }
    return content.body || ''
  }, [content.lazy_load, content.body, inView])

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: htmlContent
      }}
      ref={refIntersectionObserver}
      style={{
        height: '100%'
      }}
    />
  )
}
