import { CSSProperties } from 'react'
import Container, { ContainerProps } from '@mui/material/Container'
import { LmComponentRender } from '../CoreComponents'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmSectionProps } from './sectionTypes'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import { formColorDarkSx } from '../../utils/jss/formColorStyles'
import Box from '@mui/material/Box'
import { Theme, useTheme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import clsx from 'clsx'

const fullHeightSx: SystemStyleObject<Theme> = {
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  '& .lm-grid-row__wrap': {
    minHeight: 'inherit'
  },
  '& .lm-grid-column__wrap': {
    height: '100%'
  }
}

const backgroundSx: SystemStyleObject<Theme> = {
  position: 'relative',
  '& .MuiGrid2-root': {
    position: 'relative'
  }
}

function getContainerLayout(
  content: LmSectionProps['content'],
  defaultWidth: Theme['defaultContainerWidth']
) {
  const containerStyles: CSSProperties = {}
  const isFullHeight = !!(
    content.property && content.property.includes('is_full_height')
  )
  if (!isFullHeight) {
    const splittedPadding = content.padding?.split(' ') || []
    if (splittedPadding.length > 2) {
      containerStyles.padding = content.padding
    }
    containerStyles.paddingTop = splittedPadding[0] || '2.5rem'
    containerStyles.paddingBottom = splittedPadding[0] || '2.5rem'
  }

  const maxWidth = content.max_width
    ? content.max_width === 'none'
      ? false
      : content.max_width
    : defaultWidth

  return { containerStyles, isFullHeight, maxWidth }
}

export function LmSection({
  content,
  sectionPosition
}: LmSectionProps): React.JSX.Element {
  const theme = useTheme()
  const background: BackgroundStoryblok | undefined = content.background?.[0]

  const { style, className, sx } = useBackgroundBox({
    variant: content.variant || content.presetVariant,
    background,
    styles: content.styles,
    stylesMobile: content.styles_mobile,
    stylesTablet: content.styles_tablet,
    stylesHover: content.styles_hover
  })
  const body = content.body || []
  const { containerStyles, isFullHeight, maxWidth } = getContainerLayout(
    content,
    theme.defaultContainerWidth
  )

  // todo className doubled used
  return (
    <Box
      className={clsx('lm-section', className)}
      sx={[backgroundSx, !!content.variant && formColorDarkSx, ...sx]}
      style={{
        ...style,
        overflow: content.property?.includes('allow_overflow')
          ? undefined
          : 'hidden'
      }}
      id={content.section_identifier || content._uid}
    >
      {background?.image && (
        <BackgroundImage
          sectionPosition={sectionPosition}
          content={background}
          backgroundStyle={content.background_style}
        />
      )}
      {!!background?.background_elements?.length && (
        <BackgroundElements elements={background.background_elements} />
      )}
      <Container
        style={containerStyles}
        maxWidth={maxWidth as ContainerProps['maxWidth']}
        className={className}
        sx={[...sx, isFullHeight && fullHeightSx]}
      >
        {body.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </Container>
    </Box>
  )
}
