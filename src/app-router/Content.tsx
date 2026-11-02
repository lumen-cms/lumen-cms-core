import 'server-only'

import type { ComponentRenderContent } from '../typings/app'
import type { GridDirection } from '../vendor/grid/GridProps'
import {
  StaticParagraph,
  StaticHeadline,
  supportsStaticHeadline
} from './StaticText'
import { ClientBlock, type ClientBlockContent } from './ClientBlock'
import {
  SectionFrame,
  RowFrame,
  ColumnFrame,
  FlexFrame,
  HeadlineFrame
} from './frames'

type Props = {
  content: ComponentRenderContent
  sectionPosition?: number
  direction?: GridDirection | ''
}

const clientBlocks = new Set([
  'button',
  'button_list',
  'nav_menu',
  'toolbar_logo',
  'toolbar_navi_button',
  'toolbar_row_section',
  'toolbar_row',
  'date_headline',
  'divider',
  'rich_text_editor',
  'image',
  'avatar',
  'html',
  'iframe',
  'list_search_autocomplete',
  'snackbar'
])

export function Content({
  content,
  sectionPosition,
  direction
}: Props): React.JSX.Element {
  switch (content.component) {
    case 'section': {
      const { body, ...frame } = content
      return (
        <SectionFrame content={frame} sectionPosition={sectionPosition}>
          {body?.map((blok) => (
            <Content content={blok} key={blok._uid} />
          ))}
        </SectionFrame>
      )
    }
    case 'row': {
      const { body, ...frame } = content
      return (
        <RowFrame content={frame}>
          {body?.map((blok) => (
            <Content
              content={blok}
              direction={content.direction}
              key={blok._uid}
            />
          ))}
        </RowFrame>
      )
    }
    case 'column': {
      const { body, ...frame } = content
      return (
        <ColumnFrame content={frame} parent={{ direction }}>
          {body?.map((blok) => (
            <Content content={blok} key={blok._uid} />
          ))}
        </ColumnFrame>
      )
    }
    case 'flex_row': {
      const { body, ...frame } = content
      return (
        <FlexFrame content={frame}>
          {body?.map((blok) => (
            <Content content={blok} key={blok._uid} />
          ))}
        </FlexFrame>
      )
    }
    case 'paragraph': {
      return <StaticParagraph content={content} />
    }
    case 'headline': {
      if (supportsStaticHeadline(content))
        return <StaticHeadline content={content} />
      if (content.countdown_time || content.count_end || content.count_start) {
        return <ClientBlock content={content} />
      }
      const { text, text_xs, ...frame } = content
      return (
        <HeadlineFrame content={frame}>
          {text_xs ? (
            <>
              <span className="d-none d-sm-block">{text}</span>
              <span className="d-block d-sm-none">{text_xs}</span>
            </>
          ) : (
            text
          )}
        </HeadlineFrame>
      )
    }
    default:
      if (clientBlocks.has(content.component))
        return <ClientBlock content={content as ClientBlockContent} />
      throw new Error(
        `App Router pilot does not support CMS component: ${content.component}`
      )
  }
}
