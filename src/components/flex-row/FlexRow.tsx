import * as React from 'react'
import { FlexRowStoryblok } from '../../typings/generated/components-schema'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { useAppContext } from '../provider/AppProvider'

export type LmFlexRowProps = { content: FlexRowStoryblok }

export function LmFlexRow({ content }: LmFlexRowProps): JSX.Element {
  const body = content.body || []
  const { ComponentRender } = useAppContext()

  return (
    <Grid container
          direction={content.column ? 'column' : 'row'}
          justify={content.justify ? content.justify : undefined}
          alignItems={content.align_items ? content.align_items : undefined}
          alignContent={content.align_content ? content.align_content : undefined}
          className={clsx(content.class_names && content.class_names.values, {
            'mh-100': content.full_height
          })}
    >
      {body.map((item, i) => ComponentRender({ content: item, i }))}
    </Grid>
  )
}
