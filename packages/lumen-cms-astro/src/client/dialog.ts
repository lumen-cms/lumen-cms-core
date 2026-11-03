import { prefersReducedMotion, onReducedMotion } from './reducedMotion'
import { onUnmount } from './lifecycle'

export function initializeDialogs() {
 document.querySelectorAll<HTMLElement>('[data-lm-dialog-trigger]:not([data-dialog-initialized])').forEach(trigger => {
  trigger.dataset.dialogInitialized = 'true'
  const id = trigger.dataset.lmDialogTrigger!
  const template = document.getElementById(`${id}-template`) as HTMLTemplateElement
  let dialog: HTMLDialogElement | undefined
  const close = () => dialog?.close()
  onUnmount(trigger, close)
  trigger.addEventListener('click', event => {
   event.preventDefault()
   event.stopPropagation()
   if (dialog?.open) return
   const focus = document.activeElement as HTMLElement | null
   dialog = template.content.querySelector('dialog')!.cloneNode(true) as HTMLDialogElement
   const current = dialog
   const cleanup = new AbortController()
   current.querySelector('[data-dialog-close]')?.addEventListener('click', close)
   current.addEventListener('cancel', event => { if (current.hasAttribute('data-prevent-outside')) event.preventDefault() })
   current.addEventListener('click', event => {
    if (current.hasAttribute('data-prevent-outside') || event.target !== current) return
    const bounds = current.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) current.close()
   })
   current.addEventListener('close', () => {
    cleanup.abort(); current.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true })); current.remove(); dialog = undefined
    if (focus?.isConnected) focus.focus({ preventScroll: true })
   }, { once: true })
   window.addEventListener('popstate', close, { signal: cleanup.signal })
   document.addEventListener('astro:before-swap', close, { signal: cleanup.signal })
   document.body.append(current)
   current.showModal()
   document.dispatchEvent(new CustomEvent('lumen:content-mounted', { detail: { root: current } }))
   onReducedMotion(current, () => current.getAnimations().forEach(animation => animation.cancel()))
   if (!prefersReducedMotion() && current.hasAttribute('data-slide-up')) current.animate([{ transform: `translateY(${innerHeight - current.getBoundingClientRect().top}px)` }, { transform: 'none' }], { duration: 225, easing: 'cubic-bezier(0,0,.2,1)' })
  })
 })
}
