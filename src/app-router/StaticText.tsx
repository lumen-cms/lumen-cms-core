import 'server-only'
import { createElement } from 'react'
import clsx from 'clsx'
import type {
  HeadlineStoryblok,
  ParagraphStoryblok
} from '../typings/generated/components-schema'
import { mapTypographyVariant } from '../utils/muiMapProps'
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

export function supportsStaticHeadline(content: HeadlineStoryblok) {
  return (
    !content.countdown_time &&
    !content.count_end &&
    !content.count_start &&
    !content.color &&
    !content.max_lines &&
    !content.enable_speech &&
    !content.styles?.length &&
    !content.styles_mobile?.length &&
    !content.styles_tablet?.length &&
    !content.styles_hover?.length
  )
}

export function StaticHeadline({ content }: { content: HeadlineStoryblok }) {
  const variant =
    mapTypographyVariant[content.typography || 'headline4'] || 'body1'
  const defaultTag = /^h[1-6]$/.test(variant)
    ? variant
    : variant.startsWith('subtitle')
      ? 'h6'
      : ['body1', 'body2', 'inherit'].includes(variant)
        ? 'p'
        : 'span'
  const tag = content.tag || defaultTag
  return createElement(
    tag,
    {
      className: clsx(
        'MuiTypography-root',
        `MuiTypography-${variant}`,
        'lm-static-text',
        content.style,
        content.style_props,
        content.class_names?.values,
        {
          [`lm-font-${content.font}`]: !!content.font,
          [`MuiTypography-align${content.align?.[0]?.toUpperCase()}${content.align?.slice(1)}`]:
            !!content.align
        }
      ),
      style: {
        textAlign: content.align || undefined,
        color: content.custom_color?.rgba || undefined,
        lineHeight: content.line_height || undefined,
        fontSize: content.font_size || undefined,
        whiteSpace: content.support_linebreak ? 'pre-line' : undefined,
        letterSpacing: content.letter_spacing || undefined
      }
    },
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
