import React, { FC } from 'react'
import { LmHeadlineProps } from './headlineTypes'
import { LmHeadlineCore } from './HeadlineCore'

export const LmHeadline: FC<LmHeadlineProps> = ({ content, onClick, children }) => {

  return (
    <LmHeadlineCore content={content} onClick={onClick}>
      {children || (!!content.text_xs ? (
        <>
          <span className="d-none d-sm-block">{content.text}</span>
          <span className="d-block d-sm-none">{content.text_xs}</span>
        </>
      ) : content.text)}
    </LmHeadlineCore>
  )
}
LmHeadline.displayName = 'LmHeadline'
