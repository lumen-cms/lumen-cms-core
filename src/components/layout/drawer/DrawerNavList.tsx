import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import { NavListStoryblok } from '../../../typings/generated/components-schema'
import { DrawerButton } from './DrawerButton'

type DrawerNavListProps = { content: NavListStoryblok }

export function DrawerNavList(props: DrawerNavListProps): React.JSX.Element {
  const { content } = props
  return (
    <List subheader={<ListSubheader>{content.header}</ListSubheader>}>
      {content.body?.map((blok) => (
        <DrawerButton content={blok} key={blok._uid} />
      ))}
    </List>
  )
}
