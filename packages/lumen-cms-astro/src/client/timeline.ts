import { onReducedMotion } from './reducedMotion'
import { onUnmount } from './lifecycle'
export function initializeTimelines() {
 document.querySelectorAll<HTMLElement>('[data-lm-timeline][data-initial-color]:not([data-timeline-ready])').forEach(root => {
  root.dataset.timelineReady = 'true'
  const initial = root.dataset.initialColor!, fill = root.dataset.fillColor!
  const seen = new Set<HTMLElement>(), passed = new Set<HTMLElement>()
  let frame = 0, disposed = false, rewarded = false
  let cancelReward: (() => void) | undefined
  const reward = async () => {
   if (disposed || !root.dataset.reward || rewarded) return
   rewarded = true
   const options = JSON.parse(root.dataset.reward)
   const { fire, balloon, confetti, emoji } = await import('lumen-cms-shared/vendor/rewards.js')
   if (disposed) return
   const burst = fire(({ balloons: balloon, confetti, emoji } as Record<string, typeof confetti>)[options.type || 'confetti'], { origin: root.querySelector('[data-timeline-reward]'), config: { ...(options.elementCount ? { count: Number(options.elementCount) } : {}), ...(options.colors ? { colors: options.colors.split(',').map((color: string) => color.trim()) } : {}), ...(options.emojis ? { emojis: options.emojis.split(',') } : {}) }, zIndex: 99999 })
   cancelReward = () => burst.cancel()
  }
  const update = () => {
   frame = 0
   if (disposed) return
   const halfway = innerHeight / 2
   seen.forEach(element => {
    if (passed.has(element)) return
    const bounds = element.getBoundingClientRect()
    if (!bounds.height) return
    if (bounds.bottom < halfway) {
     element.style.background = fill; element.style.transform = ''; passed.add(element)
     if (element.hasAttribute('data-timeline-last')) void reward()
    } else if (bounds.top < halfway && bounds.bottom > halfway) {
     const depth = (bounds.bottom - halfway) / bounds.height * 100
     element.style.background = `linear-gradient(to top, ${initial} ${depth}%, ${fill} ${depth}% 100%)`
     element.style.transform = 'translateZ(0)'
    }
   })
  }
  const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update) }
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) seen.add(entry.target as HTMLElement) }); schedule() }, { threshold: .2 })
  root.querySelectorAll<HTMLElement>('[data-timeline-track]').forEach(element => { element.style.background = initial; observer.observe(element) })
  if (onReducedMotion(root, () => {
   disposed = true; observer.disconnect(); cancelAnimationFrame(frame); cancelReward?.()
   window.removeEventListener('scroll', schedule)
   root.querySelectorAll<HTMLElement>('[data-timeline-track]').forEach(element => { element.style.background = fill; element.style.transform = '' })
  })) return
  window.addEventListener('scroll', schedule, { passive: true })
  onUnmount(root, () => { disposed = true; observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); cancelReward?.() })
 })
}
