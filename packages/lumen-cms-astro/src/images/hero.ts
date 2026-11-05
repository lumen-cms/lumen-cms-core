import type { RenderContext } from '../lib/context'
import { blockChildren } from '../lib/blockProps'

/** Only predict markup owned by the built-in page/section renderers. */
export function firstSectionBackground(page: RenderContext['page'], components?: RenderContext['components']) {
 const content = page.page
 if (!content || !['page', 'error_page'].includes(content.component) || components?.[content.component]) return
 const first = blockChildren('body' in content ? content.body : undefined)[0]
 if (first?.component !== 'section' || components?.section) return
 const background = first.background?.[0]
 // Hidden breakpoint variants need their own media contract; leave their existing hints alone.
 if (background?.hide_image_on_breakpoint) return
 return background?.image || background?.alternative_image ? background : undefined
}
