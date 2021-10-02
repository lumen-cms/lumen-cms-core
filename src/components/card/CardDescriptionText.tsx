import React from 'react'
import { CardListItemProps } from './cardTypes'
import { LmHeadline } from '../headline/Headline'

function CardDescriptionText({
  content,
  options
}: CardListItemProps): JSX.Element | null {
  const descriptionMaxCharacter = options.description_max_character
  const descriptionCustomElement = options.description_custom?.[0]
  let description = descriptionCustomElement?.text || content.description
  if (!description || descriptionMaxCharacter === 0) {
    return null
  }
  if (descriptionMaxCharacter && description.length > descriptionMaxCharacter) {
    description = `${description.substr(0, descriptionMaxCharacter)}..`
  }
  return (
    <LmHeadline
      content={{
        _uid: `${content._uid}_description`,
        component: 'headline',
        typography: options.description_typography || 'body1',
        tag: 'p',
        class_names: options.description_class_name,
        ...descriptionCustomElement,
        text: description
      }}
    />
  )
}

export default CardDescriptionText
