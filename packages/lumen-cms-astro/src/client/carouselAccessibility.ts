import type Swiper from 'swiper'
import { onReducedMotion } from './reducedMotion'
import { onUnmount } from './lifecycle'

/** Autoplay must be stoppable independently of hover or pointer input. */
export function carouselAccessibility(root: HTMLElement, swiper: Swiper, autoplay: boolean) {
 const button = root.querySelector<HTMLButtonElement>('[data-carousel-pause]')
 const listeners = new AbortController()
 const sync = () => { if (button) button.textContent = swiper.autoplay.running ? 'Pause slideshow' : 'Start slideshow' }
 const stop = () => { swiper.autoplay.stop(); sync() }
 if (autoplay) {
  button?.addEventListener('click', () => { if (swiper.autoplay.running) stop(); else { swiper.autoplay.start(); sync() } }, { signal: listeners.signal })
  // Focus entering slide content stops rotation; it resumes only on explicit request.
  root.addEventListener('focusin', event => { if (event.target !== button) stop() }, { signal: listeners.signal })
  swiper.on('autoplayStart', sync); swiper.on('autoplayStop', sync)
  sync()
 }
 onReducedMotion(root, () => { stop(); swiper.params.speed = 0; swiper.setTransition(0) })
 onUnmount(root, () => { listeners.abort(); swiper.off('autoplayStart', sync); swiper.off('autoplayStop', sync) })
}
