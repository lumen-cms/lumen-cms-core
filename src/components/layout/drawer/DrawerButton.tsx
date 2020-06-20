import React from 'react'
import { ButtonStoryblok } from '../../../typings/generated/components-schema'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import LmIcon from '../../icon/LmIcon'
import { getLinkAttrs, LinkType } from '../../../utils/linkHandler'
import { useAppContext } from '../../provider/context/AppContext'

type DrawerButtonProps = { content: ButtonStoryblok }

export function DrawerButton({ content }: DrawerButtonProps): JSX.Element {
  const { LinkRender } = useAppContext()
  const buttonProps = {
    text: content.label || content.name,
    graphic: content.icon?.name
  }
  const btnProps: any = content.link ? {
    ...getLinkAttrs(content.link as LinkType, { openExternal: !!content.open_external }),
    // naked: true,
    component: LinkRender
  } : {}

  return (
    <ListItem button {...btnProps}>
      {buttonProps.graphic && (
        <ListItemIcon>
          <LmIcon iconName={buttonProps.graphic} style={{
            width: '1.5rem',
            height: '1.5rem'
          }} />
        </ListItemIcon>
      )}
      <ListItemText primary={buttonProps.text} />
    </ListItem>
  )
}
