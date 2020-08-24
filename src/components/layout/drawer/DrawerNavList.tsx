import React from 'react'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { NavMenuStoryblok } from '../../../typings/generated/components-schema'
import { DrawerButton } from './DrawerButton'

type DrawerNavListProps = { content: NavMenuStoryblok }

export function DrawerNavList(props: DrawerNavListProps): JSX.Element {
  const { content } = props
  const body = content.body || []
  return (
    <List subheader={<ListSubheader>{content.header}</ListSubheader>}>
      {body.map((blok) => (
        <DrawerButton content={blok} key={blok._uid} />
      ))}
    </List>
  )
}
