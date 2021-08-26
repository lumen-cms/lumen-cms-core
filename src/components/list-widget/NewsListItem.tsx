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

  return (
    <div key={content.uuid} className={'my-3'}>
      <MuiNextLink href={`/${content.full_slug}`}>
        <LmComponentRender
          content={
            {
              component: 'headline',
              text: title,
              typography: 'headline4',
              ...options.title?.[0]
            } as HeadlineStoryblok
          }
        />
      </MuiNextLink>
      <LmComponentRender
        content={
          {
            component: 'headline',
            text: subtitle,
            typography: 'body2',
            ...options.subtitle?.[0]
          } as HeadlineStoryblok
        }
      />
      <LmComponentRender
        content={
          {
            component: 'headline',
            text:
              typeof description === 'string'
                ? description
                : renderRichText(description),
            typography: 'body1',
            ...options.description?.[0]
          } as HeadlineStoryblok
        }
      />
      {options.read_more_label?.length && (
        <MuiNextLink href={`/${content.full_slug}`}>
          <LmComponentRender content={options.read_more_label?.[0]} />
        </MuiNextLink>
      )}
    </div>
  )
}
