import MuiNextLink from '../link/MuiNextLink'
import { useRouter } from 'next/router'
import { LmNewsListItemProps } from './listWidgetTypes'
import { LmComponentRender } from '@LmComponentRender'
import { renderRichText } from '../paragraph/renderRichText'
import { getContentFields } from './listUtils/getContentFields'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'

export default function LmNewsListItem({
  content,
  options
}: LmNewsListItemProps) {
  const { locale } = useRouter()
  const { title, description, subtitle } = getContentFields(content, {
    locale,
    hide_category: options.hide_category,
    date_format: options.date_format
  })

  const readMoreLabel = options.read_more_label?.[0]
  return (
    <div key={content.uuid} className={'my-3'}>
      <MuiNextLink href={`/${content.full_slug}`}>
        <LmComponentRender
          content={
            {
              component: 'headline',
              typography: 'headline4',
              ...options.title?.[0],
              text: title
            } as HeadlineStoryblok
          }
        />
      </MuiNextLink>
      <LmComponentRender
        content={
          {
            component: 'headline',
            typography: 'body2',
            ...options.subtitle?.[0],
            text: subtitle
          } as HeadlineStoryblok
        }
      />
      <LmComponentRender
        content={
          {
            component: 'headline',
            typography: 'body1',
            ...options.description?.[0],
            text:
              typeof description === 'string'
                ? description
                : renderRichText(description)
          } as HeadlineStoryblok
        }
      />
      {readMoreLabel && (
        <MuiNextLink href={`/${content.full_slug}`}>
          <LmComponentRender content={readMoreLabel} />
        </MuiNextLink>
      )}
    </div>
  )
}
