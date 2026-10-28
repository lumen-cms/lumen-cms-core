import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { LmMuiAvatar } from '../avatar/LmMuiAvatar'
import MuiNextLink from '../link/MuiNextLink'
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
}: ListWidgetListsProps): React.JSX.Element {
  const { locale } = useAppContext()
  const imageSize = options.image_size || 'large'
  const hideImage = options.hide_image
  return (
    <List>
      {items.map((item) => {
        const { image, title, description } = getContentFields(item, { locale })
        return (
          <ListItem key={item.uuid} disablePadding>
            <ListItemButton
              component={MuiNextLink}
              naked
              href={internalLinkHandler(item.full_slug)}
              prefetch={false}
            >
              {!hideImage && image && (
                <ListItemAvatar>
                  <LmMuiAvatar src={image} size={imageSize} />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={title}
                secondary={!options.hide_subtitle && description}
              />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}

export default ListWidgetLists
