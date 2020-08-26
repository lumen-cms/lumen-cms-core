import React from 'react'
import Grid, { GridProps } from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmComponentRender } from '../CoreComponents'
import { LmGridRowProps } from './sectionTypes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridRow: {
      height: '100%',
      minHeight: 'inherit',
      '& .MuiGrid-item': {
        '& > .MuiGrid-direction-xs-column': {
          '& > *': {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            boxSizing: 'border-box',
            '&:first-child': {
              marginTop: 0
            },
            '&:last-child': {
              marginBottom: 0
            }
          }
        },
        '& > *': {
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
          boxSizing: 'border-box',
          '&:first-child': {
            marginTop: 0
          },
          '&:last-child': {
            marginBottom: 0
          }
        }
      }
    },
    xsColumnReverse: {
      [theme.breakpoints.only('xs')]: {
        flexDirection: 'column-reverse'
      }
    },
    smColumnReverse: {
      [theme.breakpoints.only('sm')]: {
        flexDirection: 'column-reverse'
      }
    }
  })
)

export function LmGridRow({ content }: LmGridRowProps): JSX.Element {
  // const theme = useTheme()
  const classes = useStyles()
  const spacing = content.spacing
    ? (Number(content.spacing) as GridProps['spacing'])
    : 3
  const background: BackgroundStoryblok | undefined =
    Array.isArray(content.background) && content.background[0]
  const { direction } = content
  const { style, className } = useBackgroundBox({ background })

  return (
    <Grid
      container
      style={{
        ...style,
        padding: spacing ? `-${spacing * 8}px` : undefined
      }}
      spacing={spacing}
      alignItems={content.align_items ? content.align_items : undefined}
      direction={direction || undefined}
      className={clsx(className, classes.gridRow, {
        [classes.xsColumnReverse]: content.reverse_on_mobile,
        [classes.smColumnReverse]: content.reverse_on_tablet
      })}
      justify={content.justify ? content.justify : undefined}
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
      {content.body &&
        content.body.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
    </Grid>
  )
}
