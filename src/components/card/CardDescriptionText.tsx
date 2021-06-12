import React from 'react'
import { CardListItemProps } from './cardTypes'
import { LmHeadlineCore } from '../headline/HeadlineCore'

function CardDescriptionText({
  content,
  options
}: CardListItemProps): JSX.Element | null {
  let { description } = content
  const descriptionMaxCharacter = options.description_max_character
  if (!description || descriptionMaxCharacter === 0) {
    return null
  }
  if (descriptionMaxCharacter && description.length > descriptionMaxCharacter) {
    description = `${description.substr(0, descriptionMaxCharacter)}..`
  }
  return (
    <LmHeadlineCore
      content={{
        _uid: `${content._uid}_description`,
        component: 'headline',
        typography: options.description_typography || 'body1',
        tag: 'p',
        class_names: options.description_class_name,
        ...options.description_custom?.[0]
      }}
    >
      {description}
    </LmHeadlineCore>
  )
}

export default CardDescriptionText
