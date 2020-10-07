import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { LmComponentRender } from '@LmComponentRender'
import { NavMenuStoryblok } from '../../../typings/generated/components-schema'
import LmIcon from '../../icon/LmIcon'
import { DrawerButton } from './DrawerButton'
import { DrawerNavList } from './DrawerNavList'

type CollapsibleListSectionProps = {
  content: NavMenuStoryblok
  openedPath: string[]
}

type DrawerContentRenderProps = {
  content: any
  i?: number
  openedPath: string[]
  [k: string]: any
}

export function DrawerContentRender({
  content,
  openedPath
}: DrawerContentRenderProps): JSX.Element | null {
  const { component } = content
  if (component === 'button' || component === 'nav_menu_item') {
    return <DrawerButton content={content} />
  }
  if (component === 'nav_list') {
    return <DrawerNavList content={content} />
  }
  if (component === 'nav_menu') {
    return <CollapsibleListSection content={content} openedPath={openedPath} />
  }
  if (component === 'list_search_autocomplete') {
    return null
  }
  return <LmComponentRender content={content} />
}

export function CollapsibleListSection({
  content,
  openedPath
}: CollapsibleListSectionProps): JSX.Element {
  const body = content.body || []
  const items: any[] = []
  const [open, setOpen] = React.useState(openedPath.includes(content._uid))

  // useEffect(() => {
  //   if (openedPath.includes(content._uid)) {
  //     setOpen(true)
  //   }
  // }, [openedPath, content._uid])

  const handleClick = () => {
    const currentOpenState = !open
    setOpen(currentOpenState)
  }

  body.forEach((firstLevel) => {
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
            <LmIcon
              iconName={startIconName}
              style={{
                width: '1.5rem',
                height: '1.5rem'
              }}
            />
          </ListItemIcon>
        )}
        <ListItemText primary={content.title} />
        {open ? <ChevronUp /> : <ChevronDown />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <List
          component="div"
          disablePadding
          style={{ marginLeft: startIconName ? '55px' : '20px' }}
        >
          {Array.isArray(items) &&
            items.map((blok) => (
              <DrawerContentRender
                content={blok}
                key={blok._uid}
                openedPath={openedPath}
              />
            ))}
        </List>
      </Collapse>
    </>
  )
}
