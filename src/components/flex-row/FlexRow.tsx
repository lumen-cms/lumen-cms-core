import React, { FC } from 'react'
import Grid from '@mui/material/Grid'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { useTheme } from '@mui/material/styles'
import { LmFlexRowProps } from './flexRowTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  xsColumn: {
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    }
  }
}))

export const LmFlexRow: FC<LmFlexRowProps> = ({ content, children }) => {
  const body = content.body || []
  const theme = useTheme()
  const flexClasses = useStyles().classes
  const classes = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  }).classes
  return (
    <Grid
      container
      direction={content.column ? 'column' : 'row'}
      justifyContent={content.justify ? content.justify : undefined}
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
      {children ? (
        <>{children}</>
      ) : (
        body.map((item) => <LmComponentRender content={item} key={item._uid} />)
      )}
    </Grid>
  )
}
