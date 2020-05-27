import { default as React } from 'react'
import Typography from '@material-ui/core/Typography'
import { CardListItemProps } from './cards'
import clsx from 'clsx'
import { mapTypographyVariant } from '../../utils/muiMapProps'

function CardDescriptionText({ content, options }: CardListItemProps): JSX.Element | null {
  let description = content.description
  const descriptionMaxCharacter = options.description_max_character
  if (!description || descriptionMaxCharacter === 0) {
    return null
  }
  if (descriptionMaxCharacter && description.length > descriptionMaxCharacter) {
    description = description.substr(0, descriptionMaxCharacter) + '..'
  }
  return <Typography component="p"
                     variant={mapTypographyVariant[options.description_typography as string || 'body1']}
                     className={clsx(options.description_class_name && options.description_class_name.values)}>{description}</Typography>
}

export default CardDescriptionText
