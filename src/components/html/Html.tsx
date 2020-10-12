/* eslint-disable react/no-danger */
import React from 'react'
import { useInView } from 'react-intersection-observer'
import clsx from 'clsx'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmHtmlProps } from './htmlTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

export function LmHtml({ content }: LmHtmlProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const classes = useStylesAdvanced(content.styles)

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: (!content.lazy_load
          ? content.body || ''
          : inView
          ? content.body || ''
          : '') as string
      }}
      className={clsx({
        [classes.advanced]: content.styles?.length
      })}
      ref={content.lazy_load ? refIntersectionObserver : undefined}
      style={{
        height: '100%'
      }}
    />
  )
}
