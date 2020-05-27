import clsx from 'clsx'
import React from 'react'
import { ButtonListStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/AppProvider'

export type LmButtonListProps = { content: ButtonListStoryblok }

export function LmButtonList({ content }: LmButtonListProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  const body = content.body || []
  const properties = content.property || []
  const classNames = clsx('d-flex', content.class_names && content.class_names.values, {
    'lm-button-list__margin-left': properties.includes('margin_left')
  })

  return (
    <div className={classNames}>
      {body.map((blok, i) => ComponentRender({ content: blok, i }))}
    </div>
  )
}
