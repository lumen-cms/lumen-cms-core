// Reuse the application-owned allowlist. CMS strings never execute as JavaScript.
import { cmsClickActions } from 'lumen-cms-shared/core/utils/cmsClickActions'
export { cmsClickActions }
let initialized = false
export function initializeCmsActions() {
 if (initialized) return
 initialized = true
 document.addEventListener('click', event => {
  const element = (event.target as Element).closest<HTMLElement>('[data-lm-action]')
  const action = element?.dataset.lmAction
  if (action) cmsClickActions.get(action)?.()
 })
}
