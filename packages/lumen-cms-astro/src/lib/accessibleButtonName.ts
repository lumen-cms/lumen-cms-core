import type { ButtonStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import { accessibleLinkName } from './accessibleLinkName'

/** Prefer the action's context; image filenames are only a last resort. */
export function accessibleButtonName(content: ButtonStoryblok, href?: string, contextLabel?: string) {
 const label = [content.label, contextLabel, content.icon?.name].find(value => value?.trim())
 if (label) return label.trim()
 if (href) return accessibleLinkName(href)
 if (!content.image) return undefined
 try {
  const pathname = new URL(content.image, 'https://local.invalid').pathname
  // Storyblok transformation suffixes follow the original asset path.
  const filename = pathname.split('/m/')[0].split('/').pop() || ''
  return decodeURIComponent(filename).replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() || undefined
 } catch { return undefined }
}
