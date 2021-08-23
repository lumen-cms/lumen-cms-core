import MuiNextLink from '../link/MuiNextLink'
import Typography from '@material-ui/core/Typography'
import { getDateLocalized } from '../../utils/intlDateHelper'
import { useRouter } from 'next/router'
import { LmNewsListItemProps } from './listWidgetTypes'
import { LmComponentRender } from '@LmComponentRender'
import { StoryData } from 'storyblok-js-client'
import { CategoryStoryblok } from '../../typings/generated/components-schema'

export default function LmNewsListItem({
  content,
  date_format,
  read_more_label,
  hide_category
}: LmNewsListItemProps) {
  const { locale } = useRouter()
  let publishedAt =
    content.content.published || content.content.preview_publish_date
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
            publishedAt
              ? getDateLocalized({
                  start: publishedAt,
                  locale,
                  options: date_format?.[0]
                })
              : null,
            hide_category
              ? null
              : content.content.category?.content?.name ??
                content.content.categories
                  ?.map((i: StoryData<CategoryStoryblok>) => i.content?.name)
                  .join(', ')
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
      {read_more_label && (
        <MuiNextLink href={`/${content.full_slug}`}>
          <LmComponentRender content={read_more_label} />
        </MuiNextLink>
      )}
    </div>
  )
}
