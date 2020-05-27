import React from 'react'
import { NavMenuStoryblok } from '../../../typings/generated/components-schema'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import LmIcon from '../../icon/LmIcon'
import { useAppContext } from '../../provider/AppProvider'
import { DrawerButton } from './DrawerButton'
import { DrawerNavList } from './DrawerNavList'

type CollapsibleListSectionProps = {
  content: NavMenuStoryblok
}

export function CollapsibleListSection({ content }: CollapsibleListSectionProps): JSX.Element {

  const body = content.body || []
  const items: any[] = []
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    const currentOpenState = !open
    setOpen(currentOpenState)
  }

  body.forEach(firstLevel => {
    if (firstLevel.component === 'row') {
      // mega menu: consist of row / column / nav_list | button
      firstLevel.body.forEach((secondLevel: any) => {

        if (secondLevel.body && secondLevel.body.length) {
          secondLevel.body.forEach((thirdLevel: any) => {
            items.push(thirdLevel)
          })
        }
      })
    } else {
      // simple menu
      items.push(firstLevel)
    }
  })

  const startIconName = content.start_icon && content.start_icon.name
  return (
    <>
      <ListItem button onClick={handleClick}>
        {startIconName && (
          <ListItemIcon>
            <LmIcon iconName={startIconName} style={{
              width: '1.5rem',
              height: '1.5rem'
            }}></LmIcon>
          </ListItemIcon>
        )}
        <ListItemText primary={content.title} />
        {open ? <ChevronUp /> : <ChevronDown />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding style={{ marginLeft: startIconName ? '55px' : '20px' }}>
          {Array.isArray(items) && items.map((blok, i) =>
            DrawerContentRender({ content: blok, i }))}
        </List>
      </Collapse>
    </>
  )
}

type DrawerContentRenderProps = {
  content: any,
  i?: number,
  [k: string]: any
}

export function DrawerContentRender({ content, i }: DrawerContentRenderProps): JSX.Element | null {
  const { ComponentRender } = useAppContext()
  const component = content.component
  const componentProps = {
    content: content,
    key: `${component}_${i}`
  }
  if (component === 'button' || component === 'nav_menu_item') {
    return <DrawerButton {...componentProps} />
  } else if (component === 'nav_list') {
    return <DrawerNavList {...componentProps} />
  } else if (component === 'nav_menu') {
    return <CollapsibleListSection {...componentProps} />
  } else if (component === 'list_search_autocomplete') {
    return null
  } else {
    return ComponentRender({ content: content, i })
  }
}

