import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { ButtonStoryblok } from '../../../typings/generated/components-schema'
import LmIcon from '../../icon/LmIcon'
import { getLinkAttrs, LinkType } from '../../../utils/linkHandler'
import { LmCoreComponents } from '../../../utils/config'
import { useRouter } from 'next/router'

type DrawerButtonProps = { content: ButtonStoryblok }

export function DrawerButton({ content }: DrawerButtonProps): JSX.Element {
  const router = useRouter()
  const activeRoutePath = router?.asPath
  const buttonProps = {
    text: content.label || content.name,
    graphic: content.icon?.name
  }
  const cachedUrl = content.link?.cached_url
  const btnProps: any = cachedUrl
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        activeClassName: 'Mui-selected',
        // naked: true,
        component: LmCoreComponents.lm_link_render
      }
    : {}
  const isActiveRoute = activeRoutePath === `/${cachedUrl}`
  return (
    <ListItem button {...btnProps} selected={isActiveRoute}>
      {buttonProps.graphic && (
        <ListItemIcon>
          <LmIcon
            iconName={buttonProps.graphic}
            style={{
              width: '1.5rem',
              height: '1.5rem'
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText primary={buttonProps.text} />
    </ListItem>
  )
}
