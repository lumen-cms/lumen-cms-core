import {
  createRichTextRenderer,
  type StoryblokReactRichTextComponentMap,
  type StoryblokRichTextInput
} from '@storyblok/react'
import { createElement, type ReactNode, type ImgHTMLAttributes } from 'react'
import { getLinkAttrs } from '../../utils/linkHandler'
import { LmCoreComponents } from '../../utils/config'
import MuiLink from '@mui/material/Link'

type LegacyMark = { type: string; attrs?: Record<string, any> }
type RichTextNode = {
  type: string
  text?: string
  attrs?: Record<string, any>
  marks?: LegacyMark[]
  content?: RichTextNode[]
  legacyMarks?: LegacyMark[]
}
const markTags: Record<string, string> = {
  bold: 'b',
  strong: 'strong',
  italic: 'i',
  strike: 's',
  underline: 'u',
  code: 'code',
  styled: 'span'
}

// Preserve nesting, individual MUI links and the old treatment of unsupported
// marks (including existing textStyle values). Enable new styling separately.
function renderLegacyMarks(text: ReactNode, legacyMarks: LegacyMark[] = []) {
  return legacyMarks.reduceRight<ReactNode>((children, mark) => {
    const attrs = mark.attrs || {}
    if (mark.type === 'link') {
      const props: any = {
        ...getLinkAttrs(
          { cached_url: attrs.href, linktype: attrs.linktype },
          { openExternal: attrs.target === '_blank' }
        ),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
      return <MuiLink {...props}>{children}</MuiLink>
    }
    const tag = markTags[mark.type]
    return tag
      ? createElement(
          tag,
          mark.type === 'styled' ? { className: attrs.class } : null,
          children
        )
      : children
  }, text)
}
function LegacyText({ text, legacyMarks }: RichTextNode) {
  return renderLegacyMarks(text, legacyMarks)
}
function MarkedNode({
  children,
  legacyMarks
}: {
  children?: ReactNode
  legacyMarks?: LegacyMark[]
}) {
  return renderLegacyMarks(children, legacyMarks)
}
const container = (tag: string) =>
  function LegacyContainer({ children, content }: any) {
    return content?.length ? createElement(tag, null, children) : null
  }
const components: StoryblokReactRichTextComponentMap = {
  text: LegacyText,
  doc: MarkedNode,
  paragraph: container('p'),
  blockquote: container('blockquote'),
  ordered_list: container('ol'),
  bullet_list: container('ul'),
  list_item: container('li'),
  heading: ({ attrs, children }) =>
    createElement(`h${attrs.level}`, null, children),
  code_block: ({ attrs, children }) => (
    <pre>
      <code className={attrs?.class ?? undefined}>{children}</code>
    </pre>
  ),
  image: ({ attrs }) =>
    createElement(
      'img',
      attrs as unknown as ImgHTMLAttributes<HTMLImageElement>
    ),
  // Previously not rendered. Enabling embedded bloks would add page content.
  blok: () => null
}
const render = createRichTextRenderer({ components })
const emptyContainers = new Set([
  'paragraph',
  'blockquote',
  'ordered_list',
  'bullet_list',
  'list_item'
])
function preserveMarks(node: RichTextNode): RichTextNode | null {
  const { marks, content, ...rest } = node
  const children = content
    ?.map(preserveMarks)
    .filter((child): child is RichTextNode => child !== null)
  if (emptyContainers.has(node.type) && !children?.length) return null
  const normalized = { ...rest, ...(children && { content: children }) }
  if (!marks?.length) return normalized
  if (node.type === 'text') return { ...normalized, legacyMarks: marks }
  return { type: 'doc', content: [normalized], legacyMarks: marks }
}
export const renderRichText = (body: any): ReactNode => {
  if (typeof body === 'string') return body
  if (body?.type !== 'doc' || !Array.isArray(body.content)) return null
  return render(preserveMarks(body) as StoryblokRichTextInput)
}
