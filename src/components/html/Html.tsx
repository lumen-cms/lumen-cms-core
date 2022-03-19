import React, { HTMLAttributes } from 'react'
import { useInView } from 'react-intersection-observer'
import { cx as clsx } from 'tss-react/@emotion/css'
import { LmComponentRender } from '@LmComponentRender'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmHtmlProps } from './htmlTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

export function LmHtml({ content }: LmHtmlProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const classes = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  }).classes
  const divProps: HTMLAttributes<Element> = {
    className: clsx({
      [classes.advanced]: !!content.styles?.length,
      [classes.advancedTablet]: !!content.styles_tablet?.length,
      [classes.advancedMobile]: !!content.styles_mobile?.length,
      [classes.advancedHover]: !!content.styles_hover?.length
    }),
    style: {
      height:
        content.styles?.length || content.blocks?.length ? undefined : '100%'
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
