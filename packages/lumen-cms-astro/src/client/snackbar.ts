
import Cookies from 'js-cookie'
import { onUnmount } from './lifecycle'

const DISMISSAL_DURATION_MS = 4 * 60 * 60 * 1000

function readDismissalExpiry(key: string): number {
 try {
  const expiry = Number(sessionStorage.getItem(key))
  if (Number.isFinite(expiry) && expiry > Date.now()) return expiry
  sessionStorage.removeItem(key)
 } catch {
  // Storage can be unavailable; closing still works on the current page.
 }
 return 0
}

export function initializeSnackbars() {
  document.querySelectorAll<HTMLElement>('[data-lm-snackbar]').forEach(root => {
   if (root.dataset.initialized) return
   root.dataset.initialized = 'true'
   const options = JSON.parse(root.dataset.options!)
   const timers: ReturnType<typeof setTimeout>[] = []
   const listeners = new AbortController()
   onUnmount(root, () => { listeners.abort(); timers.forEach(clearTimeout) })
   const storageKey = options.id ? `lumen:snackbar:dismissed:${options.id}` : undefined
   let dismissedUntil = 0
   const isDismissed = () => !options.preview && (
    !!(options.cookie && Cookies.get(options.cookie)) ||
    Math.max(dismissedUntil, storageKey ? readDismissalExpiry(storageKey) : 0) > Date.now()
   )
   const dialog = root instanceof HTMLDialogElement ? root : undefined
   const show = (open: boolean) => {
    if (isDismissed()) open = false
    if (dialog) { if (open && !dialog.open) dialog.showModal(); if (!open && dialog.open) dialog.close() }
    else root.hidden = !open
   }
   root.querySelectorAll<HTMLElement>('[data-snackbar-accept]').forEach(action => action.addEventListener('click', event => {
    if (!(event.target as Element).closest('a,button')) return
    event.preventDefault()
    show(false)
    if (options.preview) return
    dismissedUntil = Date.now() + DISMISSAL_DURATION_MS
    if (storageKey) {
     try { sessionStorage.setItem(storageKey, String(dismissedUntil)) } catch { /* Keep the in-memory dismissal when storage is blocked. */ }
    }
    if (options.cookie) { Cookies.set(options.cookie, 'true', { expires: options.days ? Number(options.days) : 1, sameSite: 'lax', secure: location.protocol === 'https:' }) }
   }))
   if (dialog) {
    dialog.addEventListener('cancel', event => { if (options.preventOutside) event.preventDefault() })
    dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (!options.preventOutside && event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) show(false) })
   }
   show(!(options.autoShow || options.display === 'show_on_scroll'))
   window.addEventListener('scroll', () => { if (options.display === 'show_on_scroll') show(true); else if (options.display === 'hide_on_scroll') show(false) }, { once: true, passive: true, signal: listeners.signal })
   if (options.autoClose) timers.push(setTimeout(() => show(false), Number(options.autoClose)))
   if (options.autoShow) timers.push(setTimeout(() => show(true), Number(options.autoShow)))
  })
 }
