import React, { CSSProperties } from 'react'
import Container, { ContainerProps } from '@mui/material/Container'
import { LmComponentRender } from '@LmComponentRender'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmSectionProps } from './sectionTypes'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import { useFormColorStyles } from '../../utils/jss/formColorStyles'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'Section' })({
  fullHeight: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    '& .lm-grid-row__wrap': {
      minHeight: 'inherit'
    },
    '& .lm-grid-column__wrap': {
      height: '100%'
    }
  },
  background: {
    position: 'relative',
    '& .MuiGrid-root': {
      position: 'relative'
    }
  }
})

export function LmSection({
  content,
  sectionPosition
}: LmSectionProps): JSX.Element {
  const { classes, cx: clsx, theme } = useStyles()
  const classesForms = useFormColorStyles().classes
  const background: BackgroundStoryblok | undefined = content.background?.[0]

  const { style, className } = useBackgroundBox({
    variant: content.variant || content.presetVariant,
    background,
    styles: content.styles,
    stylesMobile: content.styles_mobile,
    stylesTablet: content.styles_tablet,
    stylesHover: content.styles_hover
  })
  const body = content.body || []
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
    : theme.defaultContainerWidth

  // todo className doubled used
  return (
    <div
      className={clsx(
        'lm-section',
        classes.background,
        { [classesForms.dark]: !!content.variant },
        className
      )}
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
        className={clsx(className, {
          [classes.fullHeight]: isFullHeight
        })}
      >
        {body.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </Container>
    </div>
  )
}
