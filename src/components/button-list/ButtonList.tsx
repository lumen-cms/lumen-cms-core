import clsx from 'clsx'
import React from 'react'
import { ButtonListStoryblok } from '../../typings/generated/components-schema'
import { LmComponentRender } from '../CoreComponents'

export type LmButtonListProps = { content: ButtonListStoryblok }

export function LmButtonList({ content }: LmButtonListProps): JSX.Element {
  const body = content.body || []
  const properties = content.property || []
  const classNames = clsx(
    'd-flex',
    content.class_names && content.class_names.values,
    {
      'lm-button-list__margin-left': properties.includes('margin_left')
    }
  )

  return (
    <div className={classNames}>
      {body.map((blok, i) => LmComponentRender({ content: blok, i }))}
    </div>
  )
}
