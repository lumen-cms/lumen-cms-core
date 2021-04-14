import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import { useRouter } from 'next/router'
import { Popover } from '@material-ui/core'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import LmIcon from '../icon/LmIcon'
import { NavMenuStoryblok } from '../../typings/generated/components-schema'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmMenuProps } from './menuTypes'

const useStyles = makeStyles({
  paper: (props: NavMenuStoryblok) => ({
    borderRadius: props.border_radius
  })
})

export function LmMenu({ content }: LmMenuProps): JSX.Element {
  const classes = useStyles(content)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [active, setActive] = useState<boolean>(false)
  const menuItems = content.body || []
  const isCustom =
    menuItems.length && menuItems[0].component !== 'nav_menu_item'
  const { asPath } = useRouter() || {}

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    handleClose()
  }, [asPath])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
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
    content.icon && content.icon.name ? (
      <LmIcon iconName={content.icon.name} />
    ) : (
      <ChevronDown />
    )
  const CloseIcon =
    content.icon_collapse && content.icon_collapse.name ? (
      <LmIcon iconName={content.icon_collapse.name} />
    ) : (
      <ChevronUp />
    )
  // const StartIcon = content.start_icon?.name ? <LmIcon iconName={content.start_icon.name} /> : null
  return (
    <>
      {content.title_custom?.length ? (
        content.title_custom.map((blok) => (
          <LmComponentRender
            content={blok}
            key={blok._uid}
            onClick={handleClick}
            className={active ? 'lm_menu_active' : ''}
          />
        ))
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
          className={`lm-default-color${active ? ` lm_menu_active` : ''}`}
          onClick={handleClick}
        >
          {content.title}
        </Button>
      )}
      {isCustom ? (
        <Popover
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorEl={anchorEl}
          classes={{
            paper: classes.paper
          }}
          {...addons}
        >
          <div style={{ padding: 16 }}>
            {menuItems.map((blok) => {
              const bString = JSON.stringify(blok)
              if (
                bString.includes(`"full_slug":"${asPath?.replace(/^\/+/, '')}"`)
              ) {
                !active && setActive(true)
              } else {
                active && setActive(false)
              }
              return <LmComponentRender content={blok} key={blok._uid} />
            })}
          </div>
        </Popover>
      ) : (
        <Menu
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorEl={anchorEl}
          classes={{
            paper: classes.paper
          }}
          {...addons}
        >
          {menuItems.map((nestedProps) => {
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
          })}
        </Menu>
      )}
    </>
  )
}
