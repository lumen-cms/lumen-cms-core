import { createHash } from 'node:crypto'
import { compileBlockStyles, type AdvancedStylesProps } from 'lumen-cms-shared/styles'
import type { CmsTheme } from 'lumen-cms-shared/theme'

export function blockStyles(content: {
  styles?: AdvancedStylesProps['props']; styles_mobile?: AdvancedStylesProps['props'];
  styles_tablet?: AdvancedStylesProps['props']; styles_hover?: AdvancedStylesProps['props']
}, theme: CmsTheme) {
  const props = { props: content.styles, propsMobile: content.styles_mobile, propsTablet: content.styles_tablet, propsHover: content.styles_hover }
  const className = `lm-css-${createHash('sha256').update(JSON.stringify([props, theme.palette, theme.shadows])).digest('hex').slice(0, 20)}`
  return { className, css: compileBlockStyles(`.${className}`, props, theme) }
}

import { columnWidths, columnSizeCss } from 'lumen-cms-shared/grid'
import type { ColumnStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
export function columnStyles(content: ColumnStoryblok) {
  const sizes = columnWidths(content)
  const className = `lm-span-${createHash('sha256').update(JSON.stringify(sizes)).digest('hex').slice(0, 12)}`
  return { className, css: `@layer components{.${className}{${columnSizeCss(sizes.xs)}}@media(min-width:600px){.${className}{${columnSizeCss(sizes.sm)}}}@media(min-width:900px){.${className}{${columnSizeCss(sizes.md)}}}}` }
}

/** Collect before rendering so style elements never alter CMS child selectors. */
export function collectPageStyles(value: unknown, theme: CmsTheme): string {
  const rules = new Set<string>()
  const seen = new WeakSet<object>()
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object' || seen.has(node)) return
    seen.add(node)
    const block = node as Record<string, unknown>
    if (typeof block.component === 'string') {
      const { css } = blockStyles(block, theme)
      if (css) rules.add(css)
      // News and events synthesize their default column during rendering, after head collection.
      if (block.component === 'gallery') rules.add(blockStyles({ styles: block.image_style as AdvancedStylesProps['props'] }, theme).css)
      if (block.component === 'news' || block.component === 'event') rules.add(columnStyles({ component: 'column', _uid: 'column' }).css)
      if (block.component === 'column') rules.add(columnStyles(block as unknown as ColumnStoryblok).css)
    }
    Object.values(node).forEach(visit)
  }
  visit(value)
  return [...rules].join('\n')
}
