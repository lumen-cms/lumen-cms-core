import React from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { FlexRowStoryblok } from '../../typings/generated/components-schema'
import { LmComponentRender } from '../CoreComponents'

export type LmFlexRowProps = { content: FlexRowStoryblok }

export function LmFlexRow({ content }: LmFlexRowProps): JSX.Element {
  const body = content.body || []

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
    >
      {body.map((item, i) => LmComponentRender({ content: item, i }))}
    </Grid>
  )
}
