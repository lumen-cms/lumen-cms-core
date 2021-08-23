import MuiNextLink from '../link/MuiNextLink'
import Typography from '@material-ui/core/Typography'
import { getDateLocalized } from '../../utils/intlDateHelper'
import { useRouter } from 'next/router'
import { DateTimeFormatStoryblok } from '../../typings/generated/components-schema'
import { ListStoriesData } from '../list-widget/listWidgetTypes'

type LmNewsListItemProps = {
  content: ListStoriesData
  date_format?: DateTimeFormatStoryblok[]
  read_more_label?: string
  hide_category?: boolean
  hide_read_more?: boolean
}
export default function LmNewsListItem({
  content,
  date_format,
  read_more_label,
  hide_category,
  hide_read_more
}: LmNewsListItemProps) {
  const { locale } = useRouter()
  return (
    <div key={content.uuid} className={'my-3'}>
      <MuiNextLink href={`/${content.full_slug}`}>
        <Typography variant={'h4'}>
          {content.content.title ||
            content.content.preview_title ||
            content.content.meta_title ||
            content.name}
        </Typography>
      </MuiNextLink>
      <Typography variant={'body2'}>
        <strong>
          {[
            getDateLocalized({
              start:
                content.content.published ||
                content.content.preview_publish_date,
              locale,
              options: date_format?.[0]
            }),
            hide_category ? null : content.content.category?.content?.name
          ]
            .filter((i) => i)
            .join(' - ')}
        </strong>
      </Typography>
      <Typography variant={'body1'}>
        {content.content.description ||
          content.content.preview_teaser ||
          content.content.preview_subtitle ||
          content.content.meta_description}
      </Typography>
      {!hide_read_more && (
        <MuiNextLink href={`/${content.full_slug}`}>
          <Typography variant={'caption'}>
            {read_more_label || 'read more..'}
          </Typography>
        </MuiNextLink>
      )}
    </div>
  )
}
