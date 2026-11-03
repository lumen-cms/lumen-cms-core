import { onReducedMotion } from './reducedMotion'
import { onUnmount } from './lifecycle'
// Native entrance transitions retain the existing CMS timing and trigger-once contract.
export function initializeMotion() {
 document.querySelectorAll<HTMLElement>('[data-lm-motion][data-motion-state="pending"]').forEach(root => {
  const child = root.querySelector<HTMLElement>(':scope > .lm-motion__transition')!
  const type = root.dataset.lmMotion
  const threshold = Number(root.dataset.motionThreshold)
  const ratio = threshold > 0 && threshold <= 100 ? Number((threshold / 100).toFixed(2)) : 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let started = false
  const start = async () => {
   if (started) return
   started = true
   observer.disconnect()
   root.dataset.motionState = 'running'
   const height = child.scrollHeight
   const automatic = height ? Math.min(Math.round((4 + 15 * (height / 36) ** .25 + height / 180) * 10), 3000) : 0
   const duration = root.dataset.motionDuration ? Math.max(0, Number(root.dataset.motionDuration)) : type === 'grow' ? automatic : type === 'collapse' ? 300 : 225
   let from: Keyframe = { opacity: 0 }, to: Keyframe = { opacity: 1 }
   if (type === 'zoom' || type === 'grow') {
    from = { transform: type === 'grow' ? 'scale(.75,.5625)' : 'scale(0)', ...(type === 'grow' ? { opacity: 0 } : {}) }
    to = { transform: 'none', ...(type === 'grow' ? { opacity: 1 } : {}) }
   } else if (type === 'slide') {
    const rect = child.getBoundingClientRect()
    const direction = root.dataset.motionDirection
    from = { transform: direction === 'left' ? `translateX(${innerWidth - rect.left}px)` : direction === 'right' ? `translateX(${-rect.right}px)` : direction === 'up' ? `translateY(${innerHeight - rect.top}px)` : `translateY(${-rect.bottom}px)` }
    to = { transform: 'none' }
   } else if (type === 'collapse') {
    from = { height: '0px' }; to = { height: `${height}px` }
   }
   child.style.visibility = 'visible'
   const animation = child.animate([from, to], { duration, easing: type === 'slide' ? 'cubic-bezier(0,0,.2,1)' : 'cubic-bezier(.4,0,.2,1)' })
   await animation.finished.catch(() => {})
   root.dataset.motionState = 'complete'
  }
  const observer = new IntersectionObserver(entries => {
   if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= ratio)) {
    timer ??= setTimeout(start, Math.max(0, Number(root.dataset.motionDelay) || 0))
   } else if (!started) { clearTimeout(timer); timer = undefined }
  }, { threshold: ratio })
  const finish = () => {
   started = true
   observer.disconnect(); clearTimeout(timer)
   child.getAnimations().forEach(animation => animation.cancel())
   child.style.visibility = 'visible'
   root.dataset.motionState = 'complete'
  }
  if (!onReducedMotion(root, finish)) {
   observer.observe(root)
   root.dataset.motionState = 'observing'
  }
  onUnmount(root, () => { observer.disconnect(); clearTimeout(timer); child.getAnimations().forEach(animation => animation.cancel()) })
 })
}
