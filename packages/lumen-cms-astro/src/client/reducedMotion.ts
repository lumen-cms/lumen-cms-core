import { onUnmount } from './lifecycle'

/** Stop decorative motion immediately, including when the OS preference changes.
 * Do not restart it automatically when the preference is switched back. */
export function onReducedMotion(root: HTMLElement, stop: () => void) {
 const media = matchMedia('(prefers-reduced-motion: reduce)')
 const update = () => { if (media.matches) stop() }
 media.addEventListener('change', update)
 onUnmount(root, () => media.removeEventListener('change', update))
 update()
 return media.matches
}
export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
