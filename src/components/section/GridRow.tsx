import React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { LmComponentRender } from '@LmComponentRender'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmGridRowProps } from './sectionTypes'
import { makeStyles } from 'tss-react/mui'
import WrapGridContainer from './WrapGridContainer'

const useStyles = makeStyles({ name: 'GridRow' })((theme) => ({
  gridRow: {
    height: '100%',
    minHeight: 'inherit',
    '&.MuiGrid2-container > .MuiGrid2-root': {
      '& > .MuiGrid2-direction-xs-column, & > .lm-column-stack__root, & > .lm-grid-column__wrap > .MuiGrid2-direction-xs-column, & > .lm-grid-column__wrap > .lm-column-stack__root':
        {
          '& > *': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            boxSizing: 'border-box',
            '&:first-of-type': {
              marginTop: 0
            },
            '&:last-child': {
              marginBottom: 0
            }
          }
        },
      '& > *, & > .lm-grid-column__wrap > *': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        boxSizing: 'border-box',
        '&:first-of-type': {
          marginTop: 0
        },
        '&:last-child': {
          marginBottom: 0
        }
      },
      '&.lm-column__bg-image .lm-grid-column__wrap > :last-child': {
        position: 'relative'
      }
    }
  },
  xsColumnReverse: {
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column-reverse',
      flexWrap: 'initial',
      alignItems: 'stretch'
    }
  },
  smColumnReverse: {
    [theme.breakpoints.only('sm')]: {
      flexDirection: 'column-reverse',
      flexWrap: 'initial',
      alignItems: 'stretch'
    }
  }
}))

export function LmGridRow({ content }: LmGridRowProps): JSX.Element {
  // const theme = useTheme()
  const { classes, cx } = useStyles()
  const spacing = Number(content.spacing || 3)

  const background: BackgroundStoryblok | undefined = content.background?.[0]
  const { direction } = content
  const { style, className } = useBackgroundBox({
    background,
    styles: content.styles,
    stylesMobile: content.styles_mobile,
    stylesTablet: content.styles_tablet,
    stylesHover: content.styles_hover
  })
  return (
    <WrapGridContainer
      hasCustomStyles={!!(style || className)}
      style={style}
      className={cx('lm-grid-row__wrap', className)}
    >
      <Grid
        id={content.section_identifier || undefined}
        container
        spacing={spacing}
        alignItems={content.align_items ? content.align_items : undefined}
        direction={direction || undefined}
        className={cx('lm-grid__row', classes.gridRow, {
          [classes.xsColumnReverse]: content.reverse_on_mobile,
          [classes.smColumnReverse]: content.reverse_on_tablet
        })}
        wrap={content.flex_wrap || undefined}
        justifyContent={content.justify ? content.justify : undefined}
        alignContent={content.align_content ? content.align_content : undefined}
      >
        {background?.image && (
          <BackgroundImage
            content={background}
            backgroundStyle={content.background_style}
          />
        )}
        {background?.background_elements &&
          background.background_elements.length > 0 && (
            <BackgroundElements elements={background.background_elements} />
          )}
        {content.body?.map((blok) => (
          <LmComponentRender
            content={blok}
            key={blok._uid}
            parent={{ direction: content.direction }}
          />
        ))}
      </Grid>
    </WrapGridContainer>
  )
}
