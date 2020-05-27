import * as React from 'react'
import { ButtonStoryblok } from '../../../typings/generated/components-schema'
import ContentLink from '../../link/ContentLink'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import LmIcon from '../../icon/LmIcon'

type DrawerButtonProps = { content: ButtonStoryblok }

export function DrawerButton(props: DrawerButtonProps): JSX.Element {
  const { content } = props
  const buttonProps = {
    text: content.label || content.name,
    graphic: content.icon?.name
  }

  return (
    <ContentLink content={content} className="lm-drawer__link" passHref={true}>
      <ListItem button>
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
    </ContentLink>
  )
}
