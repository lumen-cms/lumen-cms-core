import { onUnmount } from './lifecycle'
import { prefersReducedMotion } from './reducedMotion'

export function initializeTabs() {
 document.querySelectorAll<HTMLElement>('[data-lm-tabs]').forEach(root => {
  if (root.dataset.initialized) return
  root.dataset.initialized = 'true'
  const list = root.querySelector<HTMLElement>(':scope > [role="tablist"]')!
  const viewport = root.querySelector<HTMLElement>(':scope > .lm-tab-panels')!
  const tabs = Array.from(list.children) as HTMLButtonElement[]
  const panels = Array.from(viewport.children) as HTMLElement[]
  const bodies = panels.map(panel => panel.querySelector<HTMLElement>(':scope > .lm-tab-panel')!)
  const listeners = new AbortController(), signal = listeners.signal
  let active = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'))
  let destination: number | undefined, frame = 0, settleTimer: ReturnType<typeof setTimeout> | undefined
  let lastWidth = 0, suppressClick = false
  const rtl = getComputedStyle(viewport).direction === 'rtl'
  const height = () => {
   viewport.style.height = bodies[active] ? `${bodies[active].getBoundingClientRect().height}px` : '0px'
  }
  const select = (index: number) => {
   active = index
   tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1 })
   panels.forEach((panel, i) => {
    if (i !== index && panel.contains(document.activeElement)) tabs[index]?.focus({ preventScroll: true })
    panel.inert = i !== index; panel.setAttribute('aria-hidden', String(i !== index)); panel.tabIndex = i === index ? 0 : -1
    bodies[i].hidden = i !== index
   })
   height()
  }
  const align = (index: number, smooth: boolean) => {
   if (!panels[index]) return
   const rect = viewport.getBoundingClientRect(), panel = panels[index].getBoundingClientRect()
   viewport.scrollBy({ left: rtl ? panel.right - rect.right : panel.left - rect.left, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'instant' })
  }
  const revealTab = (index = active) => {
   const rect = list.getBoundingClientRect(), tab = tabs[index]?.getBoundingClientRect()
   if (!tab) return
   list.scrollBy({ left: tab.left < rect.left ? tab.left - rect.left : tab.right > rect.right ? tab.right - rect.right : 0, top: tab.top < rect.top ? tab.top - rect.top : tab.bottom > rect.bottom ? tab.bottom - rect.bottom : 0, behavior: 'instant' })
  }
  const go = (index: number, focus = false) => {
   if (!tabs.length) return
   destination = (index + tabs.length) % tabs.length
   select(destination)
   if (focus) tabs[active].focus({ preventScroll: true })
   revealTab(); align(active, true)
  }
  const nearest = () => {
   const rect = viewport.getBoundingClientRect()
   let index = active, distance = Infinity
   panels.forEach((panel, i) => {
    const bounds = panel.getBoundingClientRect()
    const delta = Math.abs(rtl ? bounds.right - rect.right : bounds.left - rect.left)
    if (delta < distance) { distance = delta; index = i }
   })
   return index
  }
  const settled = () => {
   clearTimeout(settleTimer)
   destination = undefined
   select(nearest()); revealTab()
  }
  viewport.addEventListener('scroll', () => {
   if (!frame) frame = requestAnimationFrame(() => { frame = 0; if (destination === undefined) select(nearest()) })
   clearTimeout(settleTimer)
   settleTimer = setTimeout(settled, 150) // Fallback for browsers without scrollend.
  }, { passive: true, signal })
  viewport.addEventListener('scrollend', settled, { signal })
  tabs.forEach((tab, index) => {
   tab.addEventListener('click', () => go(index), { signal })
   tab.addEventListener('keydown', event => {
    const vertical = list.getAttribute('aria-orientation') === 'vertical'
    const next = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
    const previous = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === next ? (index + 1) % tabs.length : event.key === previous ? (index - 1 + tabs.length) % tabs.length : undefined
    if (target === undefined) return
    // Match MUI's default manual activation: navigation moves focus;
    // Enter/Space activates through the native button click.
    event.preventDefault(); tabs[target].focus({ preventScroll: true }); revealTab(target)
   }, { signal })
  })
  viewport.addEventListener('wheel', () => { destination = undefined }, { passive: true, signal })
  // Let the browser handle touch scrolling. Only edge swipes need a wrap action.
  let touch: { x: number; y: number; index: number } | undefined
  viewport.addEventListener('touchstart', event => {
   if (event.touches.length !== 1 || (event.target as Element).closest('[data-lm-tabs]') !== root) { touch = undefined; return }
   destination = undefined
   touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, index: active }
  }, { passive: true, signal })
  viewport.addEventListener('touchend', event => {
   if (!touch || !event.changedTouches.length) return
   const dx = (touch.x - event.changedTouches[0].clientX) * (rtl ? -1 : 1), dy = touch.y - event.changedTouches[0].clientY
   if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && ((touch.index === tabs.length - 1 && dx > 0) || (touch.index === 0 && dx < 0))) go(touch.index + Math.sign(dx))
   touch = undefined
  }, { passive: true, signal })
  viewport.addEventListener('touchcancel', () => { touch = undefined }, { signal })
  // Native scroll snap does not provide mouse dragging. Preserve it without
  // intercepting form controls, media, nested tabs, or ordinary link clicks.
  let drag: { x: number; y: number; scroll: number; index: number; moved: boolean } | undefined
  viewport.addEventListener('pointerdown', event => {
   const target = event.target as Element
   if (event.pointerType !== 'mouse' || event.button !== 0 || target.closest('[data-lm-tabs]') !== root || target.closest('a,button,input,textarea,select,summary,video,audio,[contenteditable]')) return
   destination = undefined
   drag = { x: event.clientX, y: event.clientY, scroll: viewport.scrollLeft, index: active, moved: false }
  }, { signal })
  viewport.addEventListener('pointermove', event => {
   if (!drag) return
   const dx = event.clientX - drag.x, dy = event.clientY - drag.y
   if (!drag.moved && Math.abs(dx) < 8) return
   if (!drag.moved && Math.abs(dy) > Math.abs(dx)) { drag = undefined; return }
   drag.moved = true; viewport.setPointerCapture(event.pointerId)
   viewport.dataset.dragging = ''; event.preventDefault()
   viewport.scrollLeft = drag.scroll - dx
  }, { signal })
  const endDrag = (event: PointerEvent) => {
   if (!drag) return
   const current = drag; drag = undefined
   delete viewport.dataset.dragging
   if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
   if (current.moved) {
    suppressClick = true
    const dx = (current.x - event.clientX) * (rtl ? -1 : 1)
    go(event.type === 'pointercancel' || Math.abs(dx) < 50 ? current.index : current.index + Math.sign(dx))
   }
  }
  viewport.addEventListener('pointerup', endDrag, { signal })
  viewport.addEventListener('pointercancel', endDrag, { signal })
  viewport.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false } }, { capture: true, signal })
  viewport.addEventListener('pointerdown', () => { suppressClick = false }, { signal })
  const media = matchMedia(`(max-width: ${Number(root.dataset.mobileBelow) - 0.05}px)`)
  const layout = () => {
   const vertical = root.dataset.vertical === 'true' && !media.matches
   root.classList.toggle('lm-tabs-vertical', vertical)
   root.classList.toggle('lm-tabs-centered', root.dataset.centered === 'true' && !media.matches)
   root.classList.toggle('lm-tabs-full', !media.matches && root.dataset.variant === 'fullWidth')
   list.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal')
   align(active, false); height()
  }
  const resize = new ResizeObserver(() => {
   if (viewport.clientWidth !== lastWidth) { lastWidth = viewport.clientWidth; destination = active; align(active, false) }
   height()
  })
  resize.observe(viewport); bodies.forEach(body => resize.observe(body))
  media.addEventListener('change', layout)
  select(active); layout()
  onUnmount(root, () => {
   listeners.abort(); resize.disconnect(); media.removeEventListener('change', layout)
   cancelAnimationFrame(frame); clearTimeout(settleTimer); delete root.dataset.initialized
  })
 })
}
