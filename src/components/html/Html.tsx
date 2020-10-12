/* eslint-disable react/no-danger */
import React, { HTMLAttributes } from 'react'
import { useInView } from 'react-intersection-observer'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmHtmlProps } from './htmlTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

export function LmHtml({ content }: LmHtmlProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const classes = useStylesAdvanced(content.styles)
  const divProps: HTMLAttributes<Element> = {
    className: clsx({
      [classes.advanced]: content.styles?.length
    }),
    style: {
      height: content.styles?.length ? undefined : '100%'
    }
  }
  if (!content.blocks?.length) {
    divProps.dangerouslySetInnerHTML = {
      __html: (!content.lazy_load
        ? content.body || ''
        : inView
        ? content.body || ''
        : '') as string
    }
    return (
      <div
        {...divProps}
        ref={content.lazy_load ? refIntersectionObserver : undefined}
      />
    )
  }
  return (
    <div
      {...divProps}
      ref={content.lazy_load ? refIntersectionObserver : undefined}
    >
      {content.blocks?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
