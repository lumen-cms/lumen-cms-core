import { onUnmount } from './lifecycle'
import { prefersReducedMotion } from './reducedMotion'

const toggles = new WeakMap<HTMLDetailsElement, (open: boolean) => void>()

export function initializeAccordions() {
 document.querySelectorAll<HTMLDetailsElement>('details.lm-accordion-item').forEach(details => {
  if (toggles.has(details)) return
  const summary = details.querySelector<HTMLElement>(':scope > summary')!
  const group = details.name
  // Keep native exclusive groups without JS; animate their closing with JS.
  details.removeAttribute('name')
  details.dataset.accordionGroup = group
  let animation: Animation | undefined
  let expanded = details.open
  const finish = (open: boolean) => {
   details.open = open
   details.style.removeProperty('height')
   details.style.removeProperty('overflow')
   animation = undefined
  }
  const toggle = (open: boolean) => {
   const from = details.getBoundingClientRect().height
   const fromMargin = getComputedStyle(details).marginTop
   animation?.cancel()
   expanded = open
   if (open && group) document.querySelectorAll<HTMLDetailsElement>('details.lm-accordion-item').forEach(other => {
    if (other !== details && other.dataset.accordionGroup === group) toggles.get(other)?.(false)
   })
   details.open = open
   details.style.removeProperty('height')
   const to = details.getBoundingClientRect().height
   const toMargin = getComputedStyle(details).marginTop
   if (prefersReducedMotion() || !details.animate || from === to) { finish(open); return }
   // Content stays exposed to layout until the closing animation completes.
   details.open = true
   details.style.overflow = 'hidden'
   animation = details.animate([
    { height: `${from}px`, marginTop: fromMargin, marginBottom: fromMargin },
    { height: `${to}px`, marginTop: toMargin, marginBottom: toMargin }
   ], { duration: 250, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' })
   const current = animation
   current.onfinish = () => { finish(open); current.cancel() }
  }
  const click = (event: MouseEvent) => {
   if ((event.target as Element).closest('a,button,input,select,textarea')) return
   event.preventDefault()
   toggle(!expanded)
  }
  toggles.set(details, toggle)
  summary.addEventListener('click', click)
  onUnmount(details, () => { animation?.cancel(); summary.removeEventListener('click', click); toggles.delete(details) })
 })
}
