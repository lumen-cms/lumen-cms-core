import React from 'react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import { NavMenuStoryblok } from '../../../typings/generated/components-schema'
import { DrawerButton } from './DrawerButton'

type DrawerNavListProps = { content: NavMenuStoryblok }

export function DrawerNavList(props: DrawerNavListProps): JSX.Element {
  const { content } = props
  return (
    <List subheader={<ListSubheader>{content.header}</ListSubheader>}>
      {content.body?.map((blok) => (
        <DrawerButton content={blok as any} key={blok._uid} />
      ))}
    </List>
  )
}
