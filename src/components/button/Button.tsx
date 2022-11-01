import Button, { ButtonProps } from '@mui/material/Button'
import Fab, { FabProps } from '@mui/material/Fab'
import React, { FC, PropsWithChildren } from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { Theme } from '@mui/material/styles'
import { LmCoreComponents } from '@CONFIG'
import { LmMuiAvatar } from '../avatar/LmMuiAvatar'
import LmIcon from '../icon/LmIcon'
import { getLinkAttrs, isValidLink, LinkType } from '../../utils/linkHandler'
import { LmButtonProps } from './buttonTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import { makeStyles } from 'tss-react/mui'

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
  raised: 'contained',
  outlined: 'outlined',
  unelevated: 'contained'
}

const mapColor: {
  [k: string]: ButtonProps['color']
} = {
  dark: 'primary',
  light: 'grey',
  primary: 'primary',
  secondary: 'secondary',
  primary_text: 'inherit',
  secondary_text: 'inherit',
  inherit: 'inherit',
  success: 'success',
  info: 'info',
  warning: 'warning'
}

const useStyles = makeStyles({ name: 'Button' })((theme: Theme) => ({
  noWhitespace: {
    whiteSpace: 'nowrap'
  },
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
  },
  buttonLabelWithAvatar: {
    '&.MuiFab-root .MuiAvatar-root, &.MuiFab-root .lm-svg-icon': {
      marginRight: theme.spacing(1)
    }
  }
}))

export const LmButton: FC<PropsWithChildren<LmButtonProps>> = ({
  children,
  content,
  onClick,
  type,
  disabled,
  additionalClassName
}) => {
  const { classes, cx: clsx } = useStyles()
  const { classes: advancedClasses } = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  const properties = content.properties || []
  const disableRipple = properties.includes('disable-ripple')
  const color = content.color ? mapColor[content.color] : 'grey'
  const className = clsx(
    classes.button,
    content.class_names?.values,
    additionalClassName,
    {
      [classes.buttonLabelWithAvatar]: !!(
        (content.image || content.icon?.name) &&
        content.label
      ),
      [advancedClasses.advanced]: !!content.styles?.length,
      [advancedClasses.advancedMobile]: !!content.styles_mobile?.length,
      [advancedClasses.advancedTablet]: !!content.styles_tablet?.length,
      [advancedClasses.advancedHover]: !!content.styles_hover?.length,
      [classes.noWhitespace]: properties.includes('no-linebreak'),
      'lm-default-color': !content.color,
      [content.corners as string]: !!content.corners,
      'lm-unelevated':
        properties.includes('disable-shadow') ||
        content.variant === 'unelevated',
      'lm-outlined': content.variant === 'outlined',
      [content.size as string]: !!content.size,
      [`lm-font-${content.font}`]: !!content.font,
      'w-100': properties.includes('fullWidth')
    }
  )

  const StartIcon = () =>
    content.image ? (
      <LmMuiAvatar
        src={content.image}
        size={content.image_size || mapAvatarSize[content.size as string]}
      />
    ) : content.icon?.name ? (
      <LmIcon iconName={content.icon.name} buttonSize={content.size} />
    ) : null
  const onClickFunc: any =
    typeof content.on_click_function === 'string'
      ? {
          onClick: () => new Function(content.on_click_function || '')()
        }
      : undefined
  const btnProps: any = onClick
    ? {
        onClick
      }
    : isValidLink(content.link as LinkType)
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render,
        ...onClickFunc
      }
    : { ...onClickFunc }
  btnProps['aria-label'] = content.label || content.icon?.name
  if (content.variant === 'fab') {
    return (
      <Fab
        disabled={!!disabled}
        variant={content.label ? 'extended' : undefined}
        {...btnProps}
        className={className}
        sx={{
          backgroundColor: content.custom_color?.rgba
            ? content.custom_color.rgba
            : undefined
        }}
        size={mapSize[content.size as any] || 'medium'}
        color={color as FabProps['color']}
        disableRipple={disableRipple}
        type={type || 'button'}
      >
        <StartIcon />
        {children || content.label}
        <LmIcon
          iconName={content.trailing_icon && content.trailing_icon.name}
          buttonSize={content.size}
        />
      </Fab>
    )
  }
  if (!content.label) {
    return (
      <IconButton
        disabled={!!disabled}
        color={color as IconButtonProps['color']}
        {...btnProps}
        size={mapIconButtonSize[content.size as string] || 'medium'}
        disableRipple={disableRipple}
        sx={{
          color: content.custom_color?.rgba
            ? content.custom_color.rgba
            : undefined,
          borderColor:
            content.variant === 'outlined' && content.custom_color?.rgba
              ? content.custom_color.rgba
              : undefined
        }}
        className={className}
        type={type || 'button'}
      >
        <LmIcon iconName={content.icon?.name} buttonSize={content.size} />
        {content.image && (
          <LmMuiAvatar
            src={content.image}
            size={content.image_size || mapAvatarSize[content.size as string]}
          />
        )}
      </IconButton>
    )
  }

  return (
    <Button
      disabled={!!disabled}
      disableRipple={disableRipple}
      size={mapSize[content.size as string]}
      {...btnProps}
      className={className}
      variant={mapVariant[content.variant as string]}
      color={color as ButtonProps['color']}
      sx={{
        justifyContent: content.align ? content.align : undefined,
        color:
          !['raised', 'unelevated'].includes(content.variant || '') &&
          content.custom_color?.rgba
            ? content.custom_color.rgba
            : undefined,
        backgroundColor:
          ['raised', 'unelevated'].includes(content.variant || '') &&
          content.custom_color?.rgba
            ? content.custom_color.rgba
            : undefined,
        borderColor:
          content.variant === 'outlined' && content.custom_color?.rgba
            ? content.custom_color.rgba
            : undefined
      }}
      startIcon={<StartIcon />}
      endIcon={
        content.trailing_icon?.name ? (
          <LmIcon
            iconName={content.trailing_icon.name}
            buttonSize={content.size}
          />
        ) : undefined
      }
      type={type || 'button'}
    >
      {children || content.label}
    </Button>
  )
}
LmButton.displayName = 'LmButton'
