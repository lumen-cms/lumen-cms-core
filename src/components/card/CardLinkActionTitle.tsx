import React from 'react'
import { CardListItemProps } from './cardTypes'
import { LmHeadlineCore } from '../headline/HeadlineCore'

function CardListActionTitles({
  content,
  options
}: CardListItemProps): JSX.Element {
  return (
    <>
      {content.title && (
        <LmHeadlineCore
          content={{
            _uid: `${content._uid}_title`,
            component: 'headline',
            typography: options.title_typography || 'headline6',
            tag: options.title_tag || 'h3',
            class_names: options.title_class_name,
            ...options.title_custom?.[0]
          }}
        >
          {content.title}
        </LmHeadlineCore>
      )}
      {content.subtitle && (
        <LmHeadlineCore
          content={{
            _uid: `${content._uid}_subtitle`,
            component: 'headline',
            typography: options.subtitle_typography || 'subtitle2',
            tag: options.subtitle_tag || 'h4',
            class_names: options.subtitle_class_name,
            ...options.subtitle_custom?.[0]
          }}
        >
          {content.subtitle}
        </LmHeadlineCore>
      )}
    </>
  )
}

export default CardListActionTitles
