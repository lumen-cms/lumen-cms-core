import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import { useRouter } from 'next/router'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import { useEffectOnce } from 'react-use'
import clsx from 'clsx'
import { Popover } from '@material-ui/core'
import LmIcon from '../icon/LmIcon'
import { NavMenuStoryblok } from '../../typings/generated/components-schema'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmMenuProps } from './menuTypes'

const useStyles = makeStyles({
  paper: (props: NavMenuStoryblok) => ({
    borderRadius: props.border_radius
  })
})

export function LmMenu({ content, initialOpen }: LmMenuProps): JSX.Element {
  const classes = useStyles(content)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [active, setActive] = useState<boolean>(false)
  const menuItems = content.body || []
  const triggerClassName = `lm-menu-trigger_${content._uid}`

  const isCustom =
    menuItems.length && menuItems[0].component !== 'nav_menu_item'
  const { asPath } = useRouter() || {}

  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    if (initialOpen) {
      const el = document.querySelector<HTMLButtonElement>(
        `.${triggerClassName}`
      )
      if (el) {
        setTimeout(() => {
          setAnchorEl(el)
        })
      }
    }
  }, [initialOpen, setAnchorEl, triggerClassName])
  useEffectOnce(() => {
    if (isCustom) {
      menuItems.forEach((blok) => {
        const bString = JSON.stringify(blok)
        if (bString.includes(`"full_slug":"${asPath?.replace(/^\/+/, '')}"`)) {
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
  }, [asPath])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  let addons = {}

  if (content.alignment === 'bottomStart') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left'
      }
    }
  } else if (content.alignment === 'bottomEnd') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    }
  } else if (content.alignment === 'bottomCenter') {
    addons = {
      getContentAnchorEl: null,
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
  const ExpandIcon =
    content.icon?.name || content.icon_custom?.[0] ? (
      <LmIcon iconName={content.icon?.name} {...content.icon_custom?.[0]} />
    ) : (
      <ChevronDown />
    )
  const CloseIcon =
    content.icon_collapse?.name || content.icon_collapse_custom?.[0] ? (
      <LmIcon
        iconName={content.icon_collapse?.name}
        {...content.icon_collapse_custom?.[0]}
      />
    ) : (
      <ChevronUp />
    )
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
          endIcon={anchorEl ? CloseIcon : ExpandIcon}
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
        PaperProps={{
          variant: content.outlined ? 'outlined' : undefined,
          elevation: content.elevation ? Number(content.elevation) : 8
        }}
        classes={{
          paper: classes.paper
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
            const btnProps: any =
              nestedProps.link?.cached_url ||
              nestedProps.link?.url ||
              nestedProps.link?.email
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
                key={nestedProps._uid}
                className={btnProps.href === asPath ? 'lm_active' : ''}
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
