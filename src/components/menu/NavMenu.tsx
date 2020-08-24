import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import { useRouter } from 'next/router'
import LmIcon from '../icon/LmIcon'
import { NavMenuStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

const useStyles = makeStyles({
  paper: (props: NavMenuStoryblok) => ({
    borderRadius: props.border_radius,
  }),
})

export type LmMenuProps = { content: NavMenuStoryblok }

export function LmMenu({ content }: LmMenuProps): JSX.Element {
  const { ComponentRender, LinkRender } = useAppContext()

  const classes = useStyles(content)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const menuItems = content.body || []
  const isCustom =
    menuItems.length && menuItems[0].component !== 'nav_menu_item'
  const router = useRouter()
  const asPath = router?.asPath

  useEffect(() => {
    handleClose()
  }, [asPath])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  let addons = {}

  if (content.alignment === 'bottomStart') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
    }
  } else if (content.alignment === 'bottomEnd') {
    addons = {
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
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
      <Button
        endIcon={anchorEl ? CloseIcon : ExpandIcon}
        startIcon={
          content.start_icon?.name && (
            <LmIcon iconName={content.start_icon.name} />
          )
        }
        aria-controls="simple-menu"
        aria-haspopup="true"
        className="lm-default-color"
        onClick={handleClick}
      >
        {content.title}
      </Button>
      <Menu
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        classes={{
          paper: classes.paper,
        }}
        {...addons}
      >
        {isCustom &&
          menuItems.map((blok, i) => ComponentRender({ content: blok, i }))}
        {!isCustom && (
          <div>
            {menuItems.map((nestedProps) => {
              const btnProps: any = nestedProps.link?.cached_url
                ? {
                    ...getLinkAttrs(nestedProps.link as LinkType, {
                      openExternal: !!nestedProps.open_external,
                    }),
                    // naked: true,
                    component: LinkRender,
                  }
                : {}

              return (
                <MenuItem {...btnProps} key={nestedProps._uid}>
                  {nestedProps.label}
                </MenuItem>
              )
            })}
          </div>
        )}
      </Menu>
    </>
  )
}
