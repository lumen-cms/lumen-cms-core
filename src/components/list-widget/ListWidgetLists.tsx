import React from 'react'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { LmMuiAvatar } from '../avatar/LmMuiAvatar'
import { ListsStoryblok } from '../../typings/generated/components-schema'
import { internalLinkHandler } from '../../utils/internalLinkHandler'
import { ListStoriesData } from './listWidgetTypes'
import { getContentFields } from './listUtils/getContentFields'
import { useAppContext } from '@context/AppContext'

type ListWidgetListsProps = {
  items: ListStoriesData[]
  options: ListsStoryblok
}

function ListWidgetLists({
  items,
  options
}: ListWidgetListsProps): JSX.Element {
  const { locale } = useAppContext()
  const imageSize = options.image_size || 'large'
  const hideImage = options.hide_image
  return (
    <List>
      {items.map((item) => {
        const { image, title, description } = getContentFields(item, { locale })
        return (
          <Link
            href={internalLinkHandler(item.full_slug)}
            key={item.uuid}
            passHref
            prefetch={false}
          >
            <ListItem component="a">
              {!hideImage && image && (
                <ListItemAvatar>
                  <LmMuiAvatar src={image} size={imageSize} />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={title}
                secondary={!options.hide_subtitle && description}
              />
            </ListItem>
          </Link>
        )
      })}
    </List>
  )
}

export default ListWidgetLists
