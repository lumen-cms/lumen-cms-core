import Button, { ButtonProps } from '@material-ui/core/Button'
import Fab, { FabProps } from '@material-ui/core/Fab'
import * as React from 'react'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import { makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { LmMuiAvatar } from '../avatar/LmMuiAvatar'
import ContentLink from '../link/ContentLink'
import LmIcon from '../icon/LmIcon'

// fab and button: small medium large, default: large
const mapSize = {
  dense: 'small',
  'lm-button-large': 'large'
}

const mapIconButtonSize = {
  dense: 'small'
}


const mapAvatarSize = {
  dense: 'small',
  'lm-button-large': 'large',
  'lm-button-xlarge': 'xlarge'
}

const mapVariant = {
  'raised': 'contained',
  'outlined': 'outlined',
  'unelevated': 'contained'
}

const mapColor = {
  'dark': 'primary',
  'light': 'default',
  'primary': 'primary',
  'secondary': 'secondary',
  'primary_text': 'inherit',
  'secondary_text': 'inherit'
}

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    '&.lm-button-shaped': {
      borderRadius: '2em'
    },
    '&.lm-button-square': {
      borderRadius: '0'
    },
    '&.lm-button-xlarge': {
      fontSize: '20px',
      '& .MuiIcon-root': {
        fontSize: '1.8rem'
      },
      '&.MuiFab-root': {
        height: '64px',
        minHeight: '64px',
        '&:not(.MuiFab-extended)': {
          width: '64px'
        }
      },
      '&.MuiFab-extended': {
        paddingLeft: '1.8rem',
        paddingRight: '1.8rem',
        borderRadius: '31px'
      }
    },
    '&.lm-outlined': {
      '&.MuiIconButton-root': {
        border: `1px solid rgba(0,0,0,0.23)`
      },
      '&.MuiIconButton-colorSecondary': {
        border: `1px solid ${theme.palette.secondary.main}`
      },
      '&.MuiIconButton-colorPrimary': {
        border: `1px solid ${theme.palette.primary.main}`
      }
    },
    '&.lm-unelevated': {
      boxShadow: 'none'
    }
  }
}))

export type LmButtonProps = { content: ButtonStoryblok }

export function LmButton({ content }: LmButtonProps): JSX.Element {
  const classes = useStyles()
  const properties = content.properties || []
  const disableRipple = !!properties.find(i => i === 'disable-ripple')
  const isUnelevated = properties.find(i => i === 'disable-shadow') || content.variant === 'unelevated'
  const color = content.color ? mapColor[content.color] : undefined
  const className = clsx(classes.button, content.class_names && content.class_names.values, {
    'lm-default-color': !content.color,
    [content.corners as string]: !!content.corners,
    'lm-unelevated': isUnelevated,
    'lm-outlined': content.variant === 'outlined',
    [content.size as string]: !!content.size,
    [`lm-font-${content.font}`]: content.font
  })

  if (content.variant === 'fab') {

    return (
      <ContentLink content={content} className={'lm-link__button'} passHref={true}>
        <Fab variant={content.label ? 'extended' : undefined}
             className={className}
             style={{
               backgroundColor: content.custom_color?.rgba ? content.custom_color.rgba : undefined
             }}
             size={mapSize[content.size as string] || 'medium'}
             color={color as FabProps['color']}
             disableRipple={disableRipple}>
          <LmIcon iconName={content.icon && content.icon.name} buttonSize={content.size} />
          {content.image && (
            <LmMuiAvatar src={content.image} size={mapAvatarSize[content.size as string]} />
          )}
          {content.label}
          <LmIcon iconName={content.trailing_icon && content.trailing_icon.name} buttonSize={content.size} />
        </Fab>
      </ContentLink>
    )
  }
  if (!content.label) {
    return (
      <ContentLink content={content} className={'lm-link__button'} passHref={true}>
        <IconButton color={color as IconButtonProps['color']}
                    size={mapIconButtonSize[content.size as string] || 'medium'}
                    disableRipple={disableRipple}
                    style={{
                      color: content.custom_color?.rgba ? content.custom_color.rgba : undefined,
                      borderColor: content.variant === 'outlined' && content.custom_color?.rgba ? content.custom_color.rgba : undefined
                    }}
                    className={className}>
          <LmIcon iconName={content.icon && content.icon.name} buttonSize={content.size} />
          {content.image && (
            <LmMuiAvatar src={content.image} size={mapAvatarSize[content.size as string]} />
          )}
        </IconButton>
      </ContentLink>
    )
  }

  return (
    <ContentLink content={content} className={'lm-link__button'} passHref={true}>
      <Button size={mapSize[content.size as string]}
              className={className}
              variant={mapVariant[content.variant as string]}
              disabled={disableRipple}
              color={color as ButtonProps['color']}
              style={{
                color: !['raised', 'unelevated'].includes(content.variant || '') && content.custom_color?.rgba ? content.custom_color.rgba : undefined,
                backgroundColor: ['raised', 'unelevated'].includes(content.variant || '') && content.custom_color?.rgba ? content.custom_color.rgba : undefined,
                borderColor: content.variant === 'outlined' && content.custom_color?.rgba ? content.custom_color.rgba : undefined
              }}
              startIcon={<LmIcon iconName={content.icon && content.icon.name} buttonSize={content.size} />}
              endIcon={<LmIcon iconName={content.trailing_icon && content.trailing_icon.name}
                               buttonSize={content.size} />}>
        {content.image && (
          <LmMuiAvatar src={content.image} size={mapAvatarSize[content.size as string]} />
        )}
        {content.label}
      </Button>
    </ContentLink>
  )
}

