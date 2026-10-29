import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import { LmComponentRender } from '../CoreComponents'
import { LmCoreComponents } from '../../utils/config'
import { useEffectOnce } from 'react-use'
import { Popover } from '@mui/material'
import LmIcon from '../icon/LmIcon'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmMenuProps } from './menuTypes'
import { useAppContext } from '../provider/context/AppContext'
import clsx from 'clsx'

function getMenuAlignment(alignment: LmMenuProps['content']['alignment']) {
  let addons = {}

  if (alignment === 'bottomStart') {
    addons = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left'
      }
    }
  } else if (alignment === 'bottomEnd') {
    addons = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    }
  } else if (alignment === 'bottomCenter') {
    addons = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    }
  }
  return addons
}

function MenuToggleIcon({
  content,
  expanded
}: Pick<LmMenuProps, 'content'> & { expanded: boolean }) {
  const ExpandIcon =
    content.icon?.name || content.icon_custom?.[0] ? (
      <LmIcon
        iconName={content.icon?.name}
        iconUrl={content.icon_custom?.[0].icon_url}
        {...content.icon_custom?.[0]}
      />
    ) : (
      <ChevronDown />
    )
  const CloseIcon =
    content.icon_collapse?.name || content.icon_collapse_custom?.[0] ? (
      <LmIcon
        iconName={content.icon_collapse?.name}
        iconUrl={content.icon_collapse_custom?.[0].icon_url}
        {...content.icon_collapse_custom?.[0]}
      />
    ) : (
      <ChevronUp />
    )
  return expanded ? CloseIcon : ExpandIcon
}

export function LmMenu({
  content,
  initialOpen
}: LmMenuProps): React.JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [active, setActive] = useState<boolean>(false)
  const menuItems = content.body || []
  const triggerClassName = `lm-menu-trigger_${content._uid}`
  const isCustom =
    menuItems.length && menuItems[0].component !== 'nav_menu_item'
  const { slug } = useAppContext()

  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    if (initialOpen) {
      const el = document.querySelector<HTMLButtonElement>(
        `.${triggerClassName}`
      )
      if (el) {
        const openTimer = setTimeout(() => {
          setAnchorEl(el)
        })
        return () => clearTimeout(openTimer)
      }
    }
    return undefined
  }, [initialOpen, setAnchorEl, triggerClassName])
  useEffectOnce(() => {
    if (isCustom) {
      menuItems.forEach((blok) => {
        const bString = JSON.stringify(blok)
        if (bString.includes(`"full_slug":"${slug?.replace(/^\/+/, '')}"`)) {
          // !active &&
          setActive(true)
        }
        // else {
        //       active && setActive(false)
        //     }
      })
    }
  })

  useEffect(() => {
    handleClose()
  }, [slug])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const addons = getMenuAlignment(content.alignment)
  // const StartIcon = content.start_icon?.name ? <LmIcon iconName={content.start_icon.name} /> : null
  const Wrap = isCustom ? Popover : Menu
  return (
    <>
      {content.title_custom?.length ? (
        content.title_custom.map((blok) => {
          return (
            <LmComponentRender
              content={blok}
              key={blok._uid}
              onClick={handleClick}
              className={clsx(triggerClassName, {
                lm_menu_active: active
              })}
            />
          )
        })
      ) : (
        <Button
          endIcon={
            <MenuToggleIcon content={content} expanded={Boolean(anchorEl)} />
          }
          startIcon={
            content.start_icon?.name && (
              <LmIcon iconName={content.start_icon.name} />
            )
          }
          aria-controls="simple-menu"
          aria-haspopup="true"
          className={clsx(triggerClassName, 'lm-default-color', {
            lm_menu_active: active
          })}
          onMouseOver={content.open_on_hover ? handleClick : undefined}
          onClick={handleClick}
        >
          {content.title}
        </Button>
      )}
      <Wrap
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        className={content.class_names?.values?.join(' ')}
        slotProps={{
          paper: {
            variant: content.outlined ? 'outlined' : undefined,
            elevation: content.elevation ? Number(content.elevation) : 8,
            sx: { borderRadius: content.border_radius }
          }
        }}
        {...addons}
      >
        {isCustom ? (
          <div style={{ padding: 16 }}>
            {menuItems.map((blok) => {
              return <LmComponentRender content={blok} key={blok._uid} />
            })}
          </div>
        ) : (
          menuItems.map((nestedProps) => {
            const link = nestedProps.link
            const btnProps: any =
              link &&
              typeof link === 'object' &&
              (('cached_url' in link && link.cached_url) ||
                ('url' in link && link.url) ||
                ('email' in link && link.email))
                ? {
                    ...getLinkAttrs(nestedProps.link as LinkType, {
                      openExternal: !!nestedProps.open_external
                    }),
                    // naked: true,
                    component: LmCoreComponents.lm_link_render
                  }
                : {}

            return (
              <MenuItem
                {...btnProps}
                sx={{ fontFamily: 'inherit' }}
                key={nestedProps._uid}
                className={btnProps.href === slug ? 'lm_active' : ''}
              >
                {nestedProps.label}
              </MenuItem>
            )
          })
        )}
      </Wrap>
    </>
  )
}
