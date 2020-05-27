import React, { useMemo } from 'react'
import { HtmlStoryblok } from '../../typings/generated/components-schema'
import { useInView } from 'react-intersection-observer'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

export type LmHtmlProps = { content: HtmlStoryblok }

export function LmHtml({ content }: LmHtmlProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(intersectionDefaultOptions)
  const htmlContent = useMemo<string>(
    () => {
      if (content.lazy_load) {
        if (inView) {
          return content.body || ''
        } else {
          return ''
        }
      } else {
        return content.body || ''
      }
    },
    [inView, content.lazy_load]
  )

  return <div dangerouslySetInnerHTML={{
    __html: htmlContent
  }} ref={refIntersectionObserver} />

}
