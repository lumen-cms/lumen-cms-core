import React from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { useTheme } from '@material-ui/core/styles'
import { LmFlexRowProps } from './flexRowTypes'

export function LmFlexRow({ content }: LmFlexRowProps): JSX.Element {
  const body = content.body || []
  const theme = useTheme()

  return (
    <Grid
      container
      direction={content.column ? 'column' : 'row'}
      justify={content.justify ? content.justify : undefined}
      alignItems={content.align_items ? content.align_items : undefined}
      alignContent={content.align_content ? content.align_content : undefined}
      className={clsx(content.class_names && content.class_names.values, {
        'mh-100': content.full_height
      })}
      style={{
        gap: content.gap ? theme.spacing(Number(content.gap)) : 0
      }}
    >
      {body.map((item) => (
        <LmComponentRender content={item} key={item._uid} />
      ))}
    </Grid>
  )
}
