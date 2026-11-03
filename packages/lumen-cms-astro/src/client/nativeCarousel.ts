import { onUnmount } from './lifecycle'
import { onReducedMotion, prefersReducedMotion } from './reducedMotion'

export interface CarouselOptions {
 loop?: boolean
 instant?: boolean
 autoplay?: number
 pauseOnHover?: boolean
 stopOnInteraction?: boolean
 onChange?: (index: number) => void
}

/** Single-slide carousel: daisyUI scroll snap plus controls, dragging and autoplay. */
export function nativeCarousel(root: HTMLElement, viewport: HTMLElement, options: CarouselOptions = {}) {
 const slides = Array.from(viewport.children) as HTMLElement[]
 const listeners = new AbortController(), signal = listeners.signal
 let wrapFrame = 0
 let index = 0, destination: number | undefined, disposed = false
 let timer: ReturnType<typeof setTimeout> | undefined, settle: ReturnType<typeof setTimeout> | undefined
 let playing = !!options.autoplay && slides.length > 1 && !prefersReducedMotion(), hovering = false
 const rtl = getComputedStyle(viewport).direction === 'rtl'
 const pause = root.querySelector<HTMLButtonElement>('[data-carousel-pause]')
 const select = (next: number) => {
  const changed = index !== next
  index = next; viewport.dataset.carouselIndex = String(index)
  slides.forEach((slide, i) => { slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'slide'); slide.setAttribute('aria-label', `${i + 1} / ${slides.length}`); slide.inert = i !== index; slide.setAttribute('aria-hidden', String(i !== index)) })
  if (changed) options.onChange?.(index)
 }
 const align = (smooth: boolean) => {
  if (!slides[index]) return
  const bounds = viewport.getBoundingClientRect(), slide = slides[index].getBoundingClientRect()
  viewport.scrollTo({ left: viewport.scrollLeft + (rtl ? slide.right - bounds.right : slide.left - bounds.left), behavior: smooth && !options.instant && !prefersReducedMotion() ? 'smooth' : 'instant' })
 }
 const schedule = () => {
  clearTimeout(timer)
  if (!disposed && playing && !hovering) timer = setTimeout(() => go((index + 1) % slides.length, true, false), options.autoplay)
  if (pause) { pause.textContent = playing ? 'Pause slideshow' : 'Start slideshow'; pause.setAttribute('aria-pressed', String(!playing)) }
 }
 const stop = () => { playing = false; schedule() }
 const interact = () => { destination = undefined; if (options.stopOnInteraction) stop(); else { clearTimeout(timer) } }
 const go = (next: number, smooth = true, user = true) => {
  if (!slides.length || disposed) return
  if (user && options.stopOnInteraction) stop()
  destination = options.loop ? (next % slides.length + slides.length) % slides.length : Math.max(0, Math.min(slides.length - 1, next))
  select(destination); align(smooth); schedule()
 }
 const settled = () => {
  clearTimeout(settle)
  if (destination !== undefined) { destination = undefined; return }
  const bounds = viewport.getBoundingClientRect()
  let closest = 0, distance = Infinity
  slides.forEach((slide, i) => {
   const rect = slide.getBoundingClientRect(), delta = Math.abs(rtl ? rect.right - bounds.right : rect.left - bounds.left)
   if (delta < distance) { closest = i; distance = delta }
  })
  select(closest); schedule()
 }
 viewport.addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(settled, 150) }, { passive: true, signal })
 viewport.addEventListener('scrollend', settled, { signal })
 viewport.addEventListener('wheel', interact, { passive: true, signal })
 let touch: { x: number; y: number; index: number } | undefined
 viewport.addEventListener('touchstart', event => {
  if (event.touches.length !== 1 || (event.target as Element).closest('.lm-native-carousel,.lm-tab-panels') !== viewport) return
  interact(); touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, index }
 }, { passive: true, signal })
 // At the first/last slide only, claim an outward horizontal gesture before
 // the browser starts scrolling. Otherwise momentum can override the rewind.
 viewport.addEventListener('touchmove', event => {
  if (!touch || !options.loop || event.touches.length !== 1) return
  const dx = (touch.x - event.touches[0].clientX) * (rtl ? -1 : 1), dy = touch.y - event.touches[0].clientY
  if (Math.abs(dx) > Math.abs(dy) && (touch.index === slides.length - 1 && dx > 0 || touch.index === 0 && dx < 0)) event.preventDefault()
 }, { passive: false, signal })
 viewport.addEventListener('touchend', event => {
  const changedTouch = event.changedTouches[0]
  if (!touch || !changedTouch) return
  const dx = (touch.x - changedTouch.clientX) * (rtl ? -1 : 1), dy = touch.y - changedTouch.clientY
  if (options.loop && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && (touch.index === slides.length - 1 && dx > 0 || touch.index === 0 && dx < 0)) {
   const target = touch.index + Math.sign(dx)
   // Finish the browser's touch gesture before rewinding at a boundary.
   wrapFrame = requestAnimationFrame(() => { wrapFrame = requestAnimationFrame(() => go(target, false)) })
  }
  touch = undefined; schedule()
 }, { passive: true, signal })
 viewport.addEventListener('touchcancel', () => { touch = undefined; schedule() }, { signal })
 let drag: { x: number; y: number; scroll: number; index: number; moved: boolean } | undefined, suppressClick = false
 viewport.addEventListener('pointerdown', event => {
  suppressClick = false
  if ((event.target as Element).closest('.lm-native-carousel,.lm-tab-panels') !== viewport || event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('a,button,input,textarea,select,summary,video,audio,[contenteditable]')) return
  interact(); drag = { x: event.clientX, y: event.clientY, scroll: viewport.scrollLeft, index, moved: false }
 }, { signal })
 viewport.addEventListener('pointermove', event => {
  if (!drag) return
  const dx = event.clientX - drag.x, dy = event.clientY - drag.y
  if (!drag.moved && Math.abs(dx) < 8) return
  if (!drag.moved && Math.abs(dy) > Math.abs(dx)) { drag = undefined; schedule(); return }
  drag.moved = true; viewport.setPointerCapture(event.pointerId); viewport.dataset.dragging = ''
  event.preventDefault(); viewport.scrollLeft = drag.scroll - dx
 }, { signal })
 const endDrag = (event: PointerEvent) => {
  if (!drag) return
  const current = drag; drag = undefined; delete viewport.dataset.dragging
  if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
  if (current.moved) {
   suppressClick = true
   const dx = (current.x - event.clientX) * (rtl ? -1 : 1)
   go(event.type === 'pointercancel' || Math.abs(dx) < 50 ? current.index : current.index + Math.sign(dx))
  } else schedule()
 }
 viewport.addEventListener('pointerup', endDrag, { signal }); viewport.addEventListener('pointercancel', endDrag, { signal })
 viewport.addEventListener('dragstart', event => event.preventDefault(), { signal })
 viewport.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false } }, { capture: true, signal })
 pause?.addEventListener('click', () => { playing = !playing && slides.length > 1; schedule() }, { signal })
 root.addEventListener('focusin', event => { if (event.target !== pause) stop() }, { signal })
 root.addEventListener('mouseenter', () => { if (options.pauseOnHover) { hovering = true; schedule() } }, { signal })
 root.addEventListener('mouseleave', () => { hovering = false; schedule() }, { signal })
 let width = viewport.clientWidth
 const resize = new ResizeObserver(() => { if (width !== viewport.clientWidth) { width = viewport.clientWidth; align(false) } })
 resize.observe(viewport)
 const destroy = () => { disposed = true; cancelAnimationFrame(wrapFrame); listeners.abort(); resize.disconnect(); clearTimeout(timer); clearTimeout(settle) }
 onReducedMotion(root, () => { stop(); align(false) }); onUnmount(root, destroy)
 select(0); align(false); schedule()
 return { go, next: () => go(index + 1), previous: () => go(index - 1), get index() { return index }, destroy }
}
