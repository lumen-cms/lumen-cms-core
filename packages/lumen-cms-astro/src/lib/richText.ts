import { getLinkAttrs } from './links'
import { createRichTextRenderer } from 'lumen-cms-shared/richText'
export { escapeHtml } from 'lumen-cms-shared/richText'
export const renderRichText = createRichTextRenderer(attrs => getLinkAttrs({ cached_url: attrs.href, linktype: attrs.linktype }, { openExternal: attrs.target === '_blank' }))
