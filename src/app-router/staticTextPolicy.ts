import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import type { HeadlineStoryblok } from '../typings/generated/components-schema'

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

export function headlineTag(content: HeadlineStoryblok, variant: string) {
  const defaultTag = /^h[1-6]$/.test(variant)
    ? variant
    : variant.startsWith('subtitle')
      ? 'h6'
      : ['body1', 'body2', 'inherit'].includes(variant)
        ? 'p'
        : 'span'
  const tag = content.tag || defaultTag
  return tag
}

export function headlinePresentation(
  content: HeadlineStoryblok,
  variant: string
): HTMLAttributes<HTMLElement> {
  return {
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
  }
}
