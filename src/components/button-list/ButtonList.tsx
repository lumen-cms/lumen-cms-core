import clsx from 'clsx'
import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { makeStyles } from '@material-ui/core/styles'
import { LmButtonListProps } from './buttonListTypes'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex'
  }
}))

export function LmButtonList({ content }: LmButtonListProps): JSX.Element {
  const styles = useStyles()
  const body = content.body || []
  const properties = content.property || []
  const classNames = clsx(
    styles.root,
    content.class_names && content.class_names.values,
    {
      'lm-button-list__margin-left': properties.includes('margin_left')
    }
  )

  return (
    <div className={classNames}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
