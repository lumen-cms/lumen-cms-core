import React from 'react'
import { BackgroundStoryblok, ColumnStoryblok } from '../../typings/generated/components-schema'
import BackgroundImage from './BackgroundImage'
import Grid from '@material-ui/core/Grid'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { useAppContext } from '../provider/AppProvider'

const xsSpanMap = {
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  'false': false,
  'auto': 'auto',
  'true': true
}

const smSpanMap = {
  1: 1,
  2: 2,
  3: 4,
  4: 6,
  5: 7,
  6: 9,
  7: 11,
  8: 12,
  'false': false,
  'auto': 'auto',
  'true': true
}
const mdSpanMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  'false': false,
  'auto': 'auto',
  'true': true
}

export type LmGridColumnProps = { content: ColumnStoryblok }

export function LmGridColumn({ content }: LmGridColumnProps): JSX.Element {
  // const classes = useStyles(content)
  const { ComponentRender } = useAppContext()

  const background: BackgroundStoryblok | undefined = (Array.isArray(content.background) && content.background[0] as BackgroundStoryblok) || undefined
  const { className, style } = useBackgroundBox({ background })
  let mdWidth = mdSpanMap[content.width_general as string]
  let smWidth = smSpanMap[content.width_tablet as string]
  if (!smWidth && mdWidth) {
    smWidth = mdWidth
    if (typeof mdWidth === 'number' && mdWidth > 8) {
      smWidth = 12
    }
  }


  return (
    <Grid item
          xs={content.width_phone ? xsSpanMap[content.width_phone as string] : 12}
          sm={smWidth}
          md={mdWidth}
          className={className}
          style={style}>
      {background?.image && <BackgroundImage content={background} />}
      {background?.background_elements && background.background_elements.length > 0 &&
      <BackgroundElements elements={background.background_elements} />}
      {(content.justify || content.align_content || content.align_items) ? (
        <Grid container
              direction={'column'}
              className={'mh-100'}
              justify={content.justify ? content.justify : undefined}
              alignItems={content.align_items ? content.align_items : undefined}
              alignContent={content.align_content ? content.align_content : undefined}
        >
          {content.body && content.body.map((blok, i) => ComponentRender({ content: blok, i }))}
        </Grid>
      ) : content.body && content.body.map((blok, i) => ComponentRender({ content: blok, i }))}
    </Grid>
  )
}
