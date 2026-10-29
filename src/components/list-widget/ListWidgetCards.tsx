import { LmComponentRender } from '../CoreComponents'
import {
  CardListItemStoryblok,
  CardListStoryblok
} from '../../typings/generated/components-schema'
import { ListStoriesData } from './listWidgetTypes'
import { getContentFields } from './listUtils/getContentFields'
import { LmImagePlaceholder } from '../image/imageTypes'
import { useAppContext } from '../provider/context/AppContext'

type ListWidgetCardsProps = {
  _uid: string
  items: ListStoriesData[]
  options?: CardListStoryblok
  disablePagination?: boolean
}

export function ListWidgetCards({
  items,
  _uid,
  options,
  disablePagination
}: ListWidgetCardsProps): React.JSX.Element {
  const { locale } = useAppContext()
  return (
    <LmComponentRender
      disablePagination={disablePagination}
      content={{
        ...(options || {}),
        _uid: _uid,
        component: 'card_list',
        body: items.map((item) => {
          const { title, image, subtitle, description } = getContentFields(
            item,
            { locale, date_format: options?.date_format }
          )
          return {
            _uid: item.uuid,
            component: 'card_list_item',
            title,
            subtitle,
            description,
            image,
            story_data: item.content.story_data,
            link: {
              cached_url: item.full_slug,
              linktype: 'story'
            }
          } as CardListItemStoryblok & {
            story_data?: LmImagePlaceholder
          }
        })
      }}
    />
  )
}
