import React from 'react'
import CardActions from '@material-ui/core/CardActions'
import { LmComponentRender } from '@LmComponentRender'
import { CardListItemProps } from './cardTypes'

function CardListItemActions({
  options,
  content
}: CardListItemProps): JSX.Element | null {
  const cardActionsBody = content.card_actions_body || []

  if (!cardActionsBody.length) {
    return null
  }
  return (
    <CardActions disableSpacing={!!options.card_actions_disable_spacing}>
      {cardActionsBody.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </CardActions>
  )
}

export default CardListItemActions
