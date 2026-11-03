import type { ParallaxController } from 'parallax-controller'
import { onReducedMotion } from './reducedMotion'
import { onUnmount } from './lifecycle'

let runtime: Promise<typeof import('./parallaxRuntime')> | undefined
const loadRuntime = () => runtime ||= import('./parallaxRuntime').catch(error => { runtime = undefined; throw error })

export function initializeParallax() {
 document.querySelectorAll<HTMLElement>('[data-lm-parallax="pending"]').forEach(root => {
  root.dataset.lmParallax = 'observing'
  let controller: ParallaxController | undefined
  let observer: IntersectionObserver | undefined
  let disposed = false, loading = false
  const listeners = new AbortController()
  const activate = async () => {
   if (disposed || controller || loading) return
   loading = true
   try {
    const { ParallaxController } = await loadRuntime()
    if (disposed) return
    observer?.disconnect()
    controller = ParallaxController.init({ scrollAxis: 'vertical' })
    const targetElement = root.querySelector<HTMLElement>('.lm-parallax-banner')!
    root.querySelectorAll<HTMLElement>('[data-parallax-layer]').forEach(el => {
     if (el.closest('[data-lm-parallax]') !== root) return
     controller!.createElement({ el, props: { shouldDisableScalingTranslations: true, ...JSON.parse(el.dataset.parallaxLayer!), targetElement } })
    })
    root.querySelectorAll('img').forEach(image => {
     if (!image.complete) image.addEventListener('load', () => controller?.update(), { once: true, signal: listeners.signal })
    })
    root.dataset.lmParallax = 'active'
    controller.update()
   } catch { if (!disposed) root.dataset.lmParallax = 'static' } finally { loading = false }
  }
  onUnmount(root, () => {
   disposed = true
   observer?.disconnect()
   listeners.abort()
   controller?.destroy()
   controller = undefined
  })
  if (onReducedMotion(root, () => {
   disposed = true
   observer?.disconnect(); listeners.abort(); controller?.destroy(); controller = undefined
   root.querySelectorAll<HTMLElement>('[data-parallax-layer]').forEach(layer => {
    if (layer.closest('[data-lm-parallax]') !== root) return
    layer.style.removeProperty('transform'); layer.style.removeProperty('opacity')
   })
   root.dataset.lmParallax = 'static'
  })) return
  const rect = root.getBoundingClientRect()
  if (rect.bottom >= -400 && rect.top <= innerHeight + 400 && rect.right >= 0 && rect.left <= innerWidth) activate()
  else {
   observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) activate()
   }, { rootMargin: '400px 0px' })
   observer.observe(root)
  }
 })
}
