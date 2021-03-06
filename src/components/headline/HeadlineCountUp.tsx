import React from 'react'
import { CountUp } from 'use-count-up'
import { useInView } from 'react-intersection-observer'
import { LmHeadlineProps } from './headlineTypes'
import { LmHeadlineCore } from './HeadlineCore'

export default function HeadlineCountUp({ content, onClick }: LmHeadlineProps) {
  const [refIntersectionObserver, inView] = useInView({
    triggerOnce: true
  })
  // const { value } = useCountUp({
  //   isCounting: true,
  //   start: content.count_start || 0,
  //   end: content.count_end || 1000,
  //   duration: content.count_duration || 2.5,
  //   suffix: content.suffix || undefined,
  //   prefix: content.prefix || undefined,
  //   easing: content.animation || undefined
  // })
  return (
    <LmHeadlineCore content={content} onClick={onClick}>
      <span ref={refIntersectionObserver}>
        <CountUp
          isCounting={inView}
          duration={
            content.count_duration ? Number(content.count_duration) : 2.5
          }
          end={content.count_end ? Number(content.count_end) : 1000}
          start={content.count_start ? Number(content.count_start) : 0}
          suffix={content.suffix || undefined}
          prefix={content.prefix || undefined}
          // easing={content.animation || undefined}
        />
      </span>
    </LmHeadlineCore>
  )
}
