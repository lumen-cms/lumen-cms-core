
import Cookies from 'js-cookie'
import { onUnmount } from './lifecycle'
export function initializeSnackbars() {
  document.querySelectorAll<HTMLElement>('[data-lm-snackbar]').forEach(root => {
   if (root.dataset.initialized) return
   root.dataset.initialized = 'true'
   const options = JSON.parse(root.dataset.options!)
   const timers: ReturnType<typeof setTimeout>[] = []
   const listeners = new AbortController()
   onUnmount(root, () => { listeners.abort(); timers.forEach(clearTimeout) })
   let dismissed = !!(options.cookie && Cookies.get(options.cookie))
   const dialog = root instanceof HTMLDialogElement ? root : undefined
   const show = (open: boolean) => {
    if (dismissed && !options.preview) open = false
    if (dialog) { if (open && !dialog.open) dialog.showModal(); if (!open && dialog.open) dialog.close() }
    else root.hidden = !open
   }
   root.querySelectorAll<HTMLElement>('[data-snackbar-accept]').forEach(action => action.addEventListener('click', event => {
    if (!(event.target as Element).closest('a,button')) return
    event.preventDefault()
    show(false)
    if (options.cookie) { Cookies.set(options.cookie, 'true', { expires: options.days ? Number(options.days) : 1, sameSite: 'lax', secure: location.protocol === 'https:' }); dismissed = true }
   }))
   if (dialog) {
    dialog.addEventListener('cancel', event => { if (options.preventOutside) event.preventDefault() })
    dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (!options.preventOutside && event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) show(false) })
   }
   show(!(dismissed || options.autoShow || options.display === 'show_on_scroll'))
   window.addEventListener('scroll', () => { if (options.display === 'show_on_scroll' && !dismissed) show(true); else if (options.display === 'hide_on_scroll') show(false) }, { once: true, passive: true, signal: listeners.signal })
   if (options.autoClose) timers.push(setTimeout(() => show(false), Number(options.autoClose)))
   if (options.autoShow || dismissed) timers.push(setTimeout(() => show(true), options.autoShow === undefined ? undefined : Number(options.autoShow)))
  })
 }
