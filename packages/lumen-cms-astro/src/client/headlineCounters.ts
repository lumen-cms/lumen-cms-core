import { countLabel, countValue, countdownValue } from 'lumen-cms-shared/headlineCounter'
import { onReducedMotion } from './reducedMotion'
import { onUnmount } from './lifecycle'

export function initializeHeadlineCounters() {
 document.querySelectorAll<HTMLElement>('[data-lm-countup]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  const { start, end, duration, easing, prefix, suffix } = root.dataset
  let frame = 0, reduced = false
  let observer: IntersectionObserver | undefined
  const run = () => {
   if (reduced) return
   observer?.disconnect()
   const began = performance.now()
   const tick = (now: number) => {
    const progress = Number(duration) <= 0 ? 1 : Math.min(1, (now - began) / (Number(duration) * 1000))
    root.textContent = countLabel(countValue(Number(start), Number(end), progress, easing), prefix, suffix)
    if (progress < 1) frame = requestAnimationFrame(tick)
   }
   frame = requestAnimationFrame(tick)
  }
  if (onReducedMotion(root, () => { reduced = true; observer?.disconnect(); cancelAnimationFrame(frame); root.textContent = countLabel(Number(end), prefix, suffix) })) return
  if ('IntersectionObserver' in window) {
   observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) run() })
   observer.observe(root)
  } else run()
  onUnmount(root, () => { observer?.disconnect(); cancelAnimationFrame(frame) })
 })
 document.querySelectorAll<HTMLElement>('[data-lm-countdown]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  let timer: ReturnType<typeof setInterval> | undefined
  const update = () => {
   const result = countdownValue(Number(root.dataset.deadline), Date.now())
   if (!result.complete) { root.querySelector('[data-countdown-value]')!.textContent = result.text; return }
   clearInterval(timer)
   const template = root.querySelector<HTMLTemplateElement>('template[data-countdown-finished]')!
   root.replaceChildren(template.content.cloneNode(true))
   root.dispatchEvent(new CustomEvent('lumen:content-mounted', { bubbles: true }))
  }
  timer = setInterval(update, Math.max(1, Number(root.dataset.interval) || 1000))
  onUnmount(root, () => clearInterval(timer))
  update()
 })
}
