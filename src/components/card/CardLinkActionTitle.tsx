import React from 'react'
import { CardListItemProps } from './cardTypes'
import { LmHeadline } from '../headline/Headline'

function CardListActionTitles({
  content,
  options
}: CardListItemProps): JSX.Element {
  const subtitleCustomElement = options.subtitle_custom?.[0]
  const titleCustomElement = options.title_custom?.[0]
  return (
    <>
      {content.title && (
        <LmHeadline
          content={{
            _uid: `${content._uid}_title`,
            component: 'headline',
            typography: options.title_typography || 'headline6',
            tag: options.title_tag || 'h3',
            class_names: options.title_class_name,
            ...titleCustomElement,
            text: titleCustomElement?.text || content.title
          }}
        />
      )}
      {content.subtitle && (
        <LmHeadline
          content={{
            _uid: `${content._uid}_subtitle`,
            component: 'headline',
            typography: options.subtitle_typography || 'subtitle2',
            tag: options.subtitle_tag || 'h4',
            class_names: options.subtitle_class_name,
            ...subtitleCustomElement,
            text: subtitleCustomElement?.text || content.subtitle
          }}
        />
      )}
    </>
  )
}

export default CardListActionTitles
