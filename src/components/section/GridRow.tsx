import Grid from '../../vendor/grid'
import { LmComponentRender } from '@LmComponentRender'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmGridRowProps } from './sectionTypes'
import WrapGridContainer from './WrapGridContainer'
import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import clsx from 'clsx'

const gridRowSx = (theme: Theme): SystemStyleObject<Theme> => ({
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
})

const columnReverse = {
  flexDirection: 'column-reverse',
  flexWrap: 'initial',
  alignItems: 'stretch'
} as const

const xsColumnReverseSx = (theme: Theme): SystemStyleObject<Theme> => ({
  [theme.breakpoints.only('xs')]: columnReverse
})

const smColumnReverseSx = (theme: Theme): SystemStyleObject<Theme> => ({
  [theme.breakpoints.only('sm')]: columnReverse
})

export function LmGridRow({ content }: LmGridRowProps): React.JSX.Element {
  const spacing = Number(content.spacing || 3)

  const background: BackgroundStoryblok | undefined = content.background?.[0]
  const { direction } = content
  const { style, className, sx } = useBackgroundBox({
    background,
    styles: content.styles,
    stylesMobile: content.styles_mobile,
    stylesTablet: content.styles_tablet,
    stylesHover: content.styles_hover
  })
  return (
    <WrapGridContainer
      hasCustomStyles={!!(style || className || sx.length)}
      style={style}
      className={clsx('lm-grid-row__wrap', className)}
      sx={sx}
    >
      <Grid
        id={content.section_identifier || undefined}
        container
        spacing={spacing}
        alignItems={content.align_items ? content.align_items : undefined}
        direction={direction || undefined}
        className="lm-grid__row"
        sx={[
          gridRowSx,
          !!content.reverse_on_mobile && xsColumnReverseSx,
          !!content.reverse_on_tablet && smColumnReverseSx
        ]}
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
