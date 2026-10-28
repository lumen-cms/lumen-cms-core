import Button, { ButtonProps } from '@mui/material/Button'
import Fab, { FabProps } from '@mui/material/Fab'
import { FC, PropsWithChildren } from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { Theme, useTheme } from '@mui/material/styles'
import { LmCoreComponents } from '@CONFIG'
import type { LmMuiAvatarProps } from '../avatar/avatarTypes'
import { LmMuiAvatar } from '../avatar/LmMuiAvatar'
import LmIcon from '../icon/LmIcon'
import { getLinkAttrs, isValidLink, LinkType } from '../../utils/linkHandler'
import { LmButtonProps } from './buttonTypes'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'
import { SystemStyleObject } from '@mui/system'
import clsx from 'clsx'

// fab and button: small medium large, default: large
const mapSize: Record<string, ButtonProps['size']> = {
  dense: 'small',
  'lm-button-large': 'large'
}

const mapIconButtonSize: Record<string, IconButtonProps['size']> = {
  dense: 'small'
}

const mapAvatarSize: Record<string, LmMuiAvatarProps['size']> = {
  dense: 'small',
  'lm-button-large': 'large',
  'lm-button-xlarge': 'xlarge'
}

const mapVariant: Record<string, ButtonProps['variant']> = {
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

export const LmButton: FC<PropsWithChildren<LmButtonProps>> = ({
  children,
  content,
  onClick,
  type,
  disabled,
  additionalClassName
}) => {
  const theme = useTheme()
  const advancedSx = getAdvancedSx({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  const properties = content.properties || []
  const disableRipple = properties.includes('disable-ripple')
  const color = content.color ? mapColor[content.color] : 'grey'
  const sxProps: SystemStyleObject<Theme> = {
    // MUI adds a zero-width character to icon slots. An empty slot inherits
    // display:block from CMS visibility classes and otherwise adds a blank line.
    // Keep the existing slot margins so inline buttons retain their old width.
    '& .MuiButton-startIcon:empty::before': {
      content: 'none'
    },
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
    },
    ...(properties.includes('no-linebreak') && {
      whiteSpace: 'nowrap'
    }),
    ...(!!((content.image || content.icon?.name) && content.label) && {
      '&.MuiFab-root .MuiAvatar-root, &.MuiFab-root .lm-svg-icon': {
        marginRight: theme.spacing(1)
      }
    })
  }
  const className = clsx(content.class_names?.values, additionalClassName, {
    'lm-default-color': !content.color,
    [content.corners as string]: !!content.corners,
    'lm-unelevated':
      properties.includes('disable-shadow') || content.variant === 'unelevated',
    'lm-outlined': content.variant === 'outlined',
    [content.size as string]: !!content.size,
    [`lm-font-${content.font}`]: !!content.font,
    'w-100': properties.includes('fullWidth')
  })

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
        sx={[
          {
            ...sxProps,
            backgroundColor: content.custom_color?.rgba
              ? content.custom_color.rgba
              : undefined
          },
          advancedSx
        ]}
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
        sx={[
          {
            ...sxProps,
            color: content.custom_color?.rgba
              ? content.custom_color.rgba
              : undefined,
            borderColor:
              content.variant === 'outlined' && content.custom_color?.rgba
                ? content.custom_color.rgba
                : undefined
          },
          advancedSx
        ]}
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
      sx={[
        {
          ...sxProps,
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
        },
        advancedSx
      ]}
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
