import { onUnmount } from './lifecycle'
import { prefersReducedMotion } from './reducedMotion'

const toggles = new WeakMap<HTMLDetailsElement, (open: boolean) => void>()
const margins = ['marginTop', 'marginBottom'] as const
function measure(element: HTMLElement, properties: readonly ('marginTop' | 'marginBottom' | 'minHeight')[]) {
 const style = getComputedStyle(element)
 return Object.fromEntries(properties.map(property => [property, style[property]]))
}

export function initializeAccordions() {
 document.querySelectorAll<HTMLDetailsElement>('details.lm-accordion-item').forEach(details => {
  if (toggles.has(details)) return
  const summary = details.querySelector<HTMLElement>(':scope > summary')!
  const title = summary.querySelector<HTMLElement>(':scope > span:first-child')!
  const group = details.name
  // Keep native exclusive groups without JS; animate their closing with JS.
  details.removeAttribute('name')
  details.dataset.accordionGroup = group
  let animation: Animation | undefined
  let headerAnimations: Animation[] = []
  let expanded = details.open
  const finish = (open: boolean) => {
   details.open = open
   headerAnimations.forEach(animation => animation.cancel())
   headerAnimations = []
   details.style.removeProperty('height')
   details.style.removeProperty('overflow')
   animation = undefined
  }
  const toggle = (open: boolean) => {
   if (expanded === open) return
   const from = details.getBoundingClientRect().height
   const fromMargin = measure(details, margins)
   const fromSummary = measure(summary, ['minHeight'])
   const fromTitle = measure(title, margins)
   animation?.cancel()
   headerAnimations.forEach(animation => animation.cancel())
   headerAnimations = []
   expanded = open
   if (open && group) document.querySelectorAll<HTMLDetailsElement>('details.lm-accordion-item').forEach(other => {
    if (other !== details && other.dataset.accordionGroup === group) toggles.get(other)?.(false)
   })
   details.open = open
   details.style.removeProperty('height')
   const to = details.getBoundingClientRect().height
   const toMargin = measure(details, margins)
   const toSummary = measure(summary, ['minHeight'])
   const toTitle = measure(title, margins)
   if (prefersReducedMotion() || !details.animate || from === to) { finish(open); return }
   // Content stays exposed to layout until the closing animation completes.
   details.open = true
   details.style.overflow = 'hidden'
   const timing: KeyframeAnimationOptions = { duration: 250, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' }
   headerAnimations = [summary.animate([fromSummary, toSummary], timing), title.animate([fromTitle, toTitle], timing)]
   animation = details.animate([
    { height: `${from}px`, ...fromMargin },
    { height: `${to}px`, ...toMargin }
   ], timing)
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
  onUnmount(details, () => { animation?.cancel(); headerAnimations.forEach(animation => animation.cancel()); summary.removeEventListener('click', click); toggles.delete(details) })
 })
}
