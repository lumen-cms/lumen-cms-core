import React, { FC } from 'react'
import dynamic from 'next/dynamic'
import { LmHeadlineProps } from './headlineTypes'
import { LmHeadlineCore } from './HeadlineCore'

const HeadlineCountUp = dynamic(() => import('./HeadlineCountUp'), {
  ssr: false
})

const HeadlineCountDown = dynamic(() => import('./HeadlineCountDown'), {
  ssr: false
})

export const LmHeadline: FC<LmHeadlineProps> = ({
  content,
  onClick,
  children
}) => {
  if (content.countdown_time) {
    return <HeadlineCountDown content={content} onClick={onClick} />
  }
  if (content.count_end || content.count_start) {
    return <HeadlineCountUp content={content} onClick={onClick} />
  }
  return (
    <LmHeadlineCore content={content} onClick={onClick}>
      {children ||
        (content.text_xs ? (
          <>
            <span className="d-none d-sm-block">{content.text}</span>
            <span className="d-block d-sm-none">{content.text_xs}</span>
          </>
        ) : (
          content.text
        ))}
    </LmHeadlineCore>
  )
}
LmHeadline.displayName = 'LmHeadline'
