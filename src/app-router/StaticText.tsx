import 'server-only'
import { createElement } from 'react'
import clsx from 'clsx'
import type {
  HeadlineStoryblok,
  ParagraphStoryblok
} from '../typings/generated/components-schema'
import { mapTypographyVariant } from '../utils/muiMapProps'
import { headlineTag, headlinePresentation } from './staticTextPolicy'
import parseMarkdownContent from '../components/paragraph/markdown-helper'

// Content-only typography needs no per-block client component. Keep MUI's
// public classes for site CSS; StaticTextStyles supplies the configured theme.
export function StaticParagraph({ content }: { content: ParagraphStoryblok }) {
  const variant = mapTypographyVariant[content.typography || 'body1'] || 'body1'
  return (
    <div
      className={clsx(
        'MuiTypography-root',
        `MuiTypography-${variant}`,
        'lm-static-text',
        'lm-markup',
        content.style,
        content.class_names?.values,
        {
          [`lm-font-${content.font}`]: !!content.font
        }
      )}
      dangerouslySetInnerHTML={{
        __html: parseMarkdownContent(content.text || '')
      }}
    />
  )
}

export function StaticHeadline({ content }: { content: HeadlineStoryblok }) {
  const variant =
    mapTypographyVariant[content.typography || 'headline4'] || 'body1'
  const tag = headlineTag(content, variant)
  return createElement(
    tag,
    headlinePresentation(content, variant),
    content.text_xs ? (
      <>
        <span className="d-none d-sm-block">{content.text}</span>
        <span className="d-block d-sm-none">{content.text_xs}</span>
      </>
    ) : (
      content.text
    )
  )
}
