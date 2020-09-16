import React from 'react'
import { useCountUp } from 'use-count-up'
import { LmHeadlineProps } from './headlineTypes'
import { LmHeadlineCore } from './HeadlineCore'
import { useInView } from 'react-intersection-observer'

export function HeadlineCountUp({ content, onClick }: LmHeadlineProps) {
  const [refIntersectionObserver, inView] = useInView(
    {
      triggerOnce: true
    }
  )
  const { value } = useCountUp({
    isCounting: inView,
    start: content.count_start || 0,
    end: content.count_end || 1000,
    duration: content.count_duration || undefined,
    suffix: content.suffix || undefined,
    prefix: content.prefix || undefined,
    easing: content.animation || undefined
  })
  return (
    <LmHeadlineCore content={content} onClick={onClick}>
      <span ref={refIntersectionObserver}>
      {value}
      </span>
    </LmHeadlineCore>
  )
}
