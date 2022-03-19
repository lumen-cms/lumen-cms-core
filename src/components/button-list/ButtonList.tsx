import { cx as clsx } from 'tss-react/@emotion/css'
import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmButtonListProps } from './buttonListTypes'

export function LmButtonList({ content }: LmButtonListProps): JSX.Element {
  const body = content.body || []
  const properties = content.property || []
  const classNames = clsx(content.class_names && content.class_names.values, {
    'lm-button-list__margin-left': properties.includes('margin_left')
  })

  return (
    <div className={classNames}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
