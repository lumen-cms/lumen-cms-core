import MuiNextLink from '../link/MuiNextLink'
import { LmNewsListItemProps } from './listWidgetTypes'
import { LmComponentRender } from '../CoreComponents'
import { renderRichText } from '../paragraph/renderRichText'
import { getContentFields } from './listUtils/getContentFields'

import { useAppContext } from '../provider/context/AppContext'

export default function LmNewsListItem({
  content,
  options
}: LmNewsListItemProps) {
  const { locale } = useAppContext()
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
          content={{
            component: 'headline',
            _uid: `${content.uuid}_title`,
            typography: 'headline4',
            ...options.title?.[0],
            text: title
          }}
        />
      </MuiNextLink>
      <LmComponentRender
        content={{
          component: 'headline',
          _uid: `${content.uuid}_subtitle`,
          typography: 'body2',
          ...options.subtitle?.[0],
          text: subtitle
        }}
      />
      <LmComponentRender
        content={{
          component: 'headline',
          _uid: `${content.uuid}_description`,
          typography: 'body1',
          ...options.description?.[0],
          text: typeof description === 'string' ? description : undefined
        }}
      >
        {typeof description !== 'string'
          ? renderRichText(description)
          : undefined}
      </LmComponentRender>
      {readMoreLabel && (
        <MuiNextLink href={`/${content.full_slug}`}>
          <LmComponentRender content={readMoreLabel} />
        </MuiNextLink>
      )}
    </div>
  )
}
