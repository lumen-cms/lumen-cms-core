import React, { CSSProperties } from 'react'
import Container, { ContainerProps } from '@material-ui/core/Container'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmComponentRender } from '../CoreComponents'
import { LmSectionProps } from './sectionTypes'

const useStyles = makeStyles({
  fullHeight: {
    width: '100%',
    height: '100%',
    minHeight: '100vh'
  },
  background: {
    position: 'relative',
    overflow: 'hidden',
    '& .MuiGrid-root': {
      position: 'relative'
    }
  },
  dark: {
    '& .MuiButton-root.lm-default-color, & .MuiIconButton-root.lm-default-color': {
      color: 'inherit',
      '&.MuiButton-outlined,&.lm-outlined': {
        borderColor: 'currentColor'
      }
    }
  }
})

export function LmSection({ content }: LmSectionProps): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()

  const background = Array.isArray(content.background) && content.background[0]
  const { style, className } = useBackgroundBox({
    variant: content.variant || content.presetVariant,
    background
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
        classes.background,
        { [classes.dark]: !!content.variant },
        className
      )}
      style={style}
      id={content.section_identifier || content._uid}
    >
      {(background?.image || background?.background_elements) && (
        <BackgroundImage
          content={background}
          backgroundStyle={content.background_style}
        />
      )}
      {background?.background_elements &&
      background.background_elements.length > 0 && (
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
