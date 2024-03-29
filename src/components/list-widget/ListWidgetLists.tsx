import React from 'react'
import List from '@material-ui/core/List'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { LmMuiAvatar } from '../avatar/LmMuiAvatar'
import { ListsStoryblok } from '../../typings/generated/components-schema'
import { AllStoryData } from '../../typings/app'
import { internalLinkHandler } from '../../utils/internalLinkHandler'

type ListWidgetListsProps = {
  items: AllStoryData
  options: ListsStoryblok
  // content: ListWidgetStoryblok
}

function ListWidgetLists({
  items,
  options
}: ListWidgetListsProps): JSX.Element {
  const imageSize = options.image_size || 'large'
  const hideImage = options.hide_image
  return (
    <List>
      {items.map((item) => (
        <Link
          href={internalLinkHandler(item.full_slug)}
          key={item.uuid}
          passHref
          prefetch={false}
        >
          <ListItem component="a">
            {!hideImage && item.content.preview_image && (
              <ListItemAvatar>
                <LmMuiAvatar
                  src={item.content.preview_image}
                  size={imageSize}
                />
              </ListItemAvatar>
            )}
            <ListItemText
              primary={item.content.preview_title || item.name}
              secondary={
                !options.hide_subtitle && item.content.preview_subtitle
              }
            />
          </ListItem>
        </Link>
      ))}
    </List>
  )
}

export default ListWidgetLists
