import React from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { LmFlexRowProps } from './flexRowTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    xsColumn: {
      [theme.breakpoints.only('xs')]: {
        flexDirection: 'column'
      }
    }
  })
)

export function LmFlexRow({ content }: LmFlexRowProps): JSX.Element {
  const body = content.body || []
  const theme = useTheme()
  const flexClasses = useStyles()
  const classes = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  return (
    <Grid
      container
      direction={content.column ? 'column' : 'row'}
      justify={content.justify ? content.justify : undefined}
      alignItems={content.align_items ? content.align_items : undefined}
      alignContent={content.align_content ? content.align_content : undefined}
      className={clsx(content.class_names?.values, {
        'mh-100': content.full_height,
        [flexClasses.xsColumn]: content.column_mobile_only,
        [classes.advanced]: content.styles?.length,
        [classes.advancedMobile]: content.styles_mobile?.length,
        [classes.advancedTablet]: content.styles_tablet?.length,
        [classes.advancedHover]: content.styles_hover?.length
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
