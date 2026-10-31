// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type Swiper from 'swiper'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { DeferredSwiper } from './DeferredSwiper'

let host: HTMLDivElement
let root: Root
const initialized = vi.fn()
const destroyed = vi.fn()

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    bottom: 200,
    left: 0,
    right: 400,
    width: 400,
    height: 200
  } as DOMRect)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
  initialized.mockClear()
  destroyed.mockClear()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

function carousel({
  slides = ['first', 'second', 'third'],
  gap = 0,
  navigation = true
} = {}) {
  // Deliberately recreate option objects, module arrays and React children.
  return (
    <DeferredSwiper
      modules={[A11y, Navigation, Pagination]}
      navigation={navigation ? { addIcons: false } : false}
      pagination={{ clickable: true }}
      breakpoints={{ 600: { slidesPerView: 1, spaceBetween: gap } }}
      spaceBetween={gap}
      speed={0}
      on={{ init: initialized, destroy: destroyed }}
    >
      {slides.map((id) => (
        <div className="swiper-slide" key={id} data-slide-id={id}>
          <input aria-label={id} defaultValue={id} />
        </div>
      ))}
    </DeferredSwiper>
  )
}

function instance() {
  return host.querySelector<HTMLDivElement & { swiper: Swiper }>('.swiper')!
    .swiper
}

function activeSlide() {
  return host
    .querySelector('.swiper-slide-active')
    ?.getAttribute('data-slide-id')
}

async function next() {
  await act(async () =>
    host.querySelector<HTMLElement>('.swiper-button-next')!.click()
  )
}

it('keeps the same instance, active slide, transform and input state across equivalent rerenders', async () => {
  await act(async () => root.render(carousel()))
  const original = instance()
  await next()
  const input = host.querySelector<HTMLInputElement>('[aria-label="second"]')!
  input.value = 'local edit'
  const transform = original.wrapperEl.style.transform
  const slideStyle = original.slides[original.activeIndex].style.cssText
  for (let i = 0; i < 3; i++) await act(async () => root.render(carousel()))
  expect(instance()).toBe(original)
  expect(initialized).toHaveBeenCalledTimes(1)
  expect(destroyed).not.toHaveBeenCalled()
  expect(activeSlide()).toBe('second')
  expect(original.wrapperEl.style.transform).toBe(transform)
  expect(original.slides[original.activeIndex].style.cssText).toBe(slideStyle)
  expect(host.querySelector('[aria-label="second"]')).toBe(input)
  expect(input.value).toBe('local edit')
  await next()
  expect(activeSlide()).toBe('third')
  await act(async () => root.unmount())
  expect(destroyed).toHaveBeenCalledTimes(1)
})

it('applies a genuine option change while retaining the active DOM slide and input value', async () => {
  await act(async () => root.render(carousel()))
  const original = instance()
  await next()
  const input = host.querySelector<HTMLInputElement>('[aria-label="second"]')!
  input.value = 'local edit'
  await act(async () => root.render(carousel({ gap: 24 })))
  expect(instance()).not.toBe(original)
  expect(initialized).toHaveBeenCalledTimes(2)
  expect(destroyed).toHaveBeenCalledTimes(1)
  expect(instance().params.spaceBetween).toBe(24)
  expect(activeSlide()).toBe('second')
  expect(host.querySelector('[aria-label="second"]')).toBe(input)
  expect(input.value).toBe('local edit')
  await next()
  expect(activeSlide()).toBe('third')
})

it('updates inserted/reordered slides without recreating Swiper or changing the active keyed slide', async () => {
  await act(async () => root.render(carousel()))
  const original = instance()
  await next()
  await act(async () =>
    root.render(carousel({ slides: ['new', 'first', 'second', 'third'] }))
  )
  expect(instance()).toBe(original)
  expect(instance().slides).toHaveLength(4)
  expect(activeSlide()).toBe('second')
  expect(instance().activeIndex).toBe(2)
  expect(initialized).toHaveBeenCalledTimes(1)
  await next()
  expect(activeSlide()).toBe('third')
})

it('clamps the active position if the active slide is removed', async () => {
  await act(async () => root.render(carousel()))
  const original = instance()
  await next()
  await next()
  await act(async () => root.render(carousel({ slides: ['first', 'second'] })))
  expect(instance()).toBe(original)
  expect(instance().activeIndex).toBe(1)
  expect(activeSlide()).toBe('second')
})

it('connects newly enabled navigation to the existing active slide', async () => {
  await act(async () => root.render(carousel({ navigation: false })))
  await act(async () => instance().slideTo(1, 0))
  await act(async () => root.render(carousel()))
  expect(activeSlide()).toBe('second')
  await next()
  expect(activeSlide()).toBe('third')
})

it('balances setup and cleanup in StrictMode without recreating on an equivalent rerender', async () => {
  await act(async () => root.render(<StrictMode>{carousel()}</StrictMode>))
  const original = instance()
  const initialCount = initialized.mock.calls.length
  await next()
  await act(async () => root.render(<StrictMode>{carousel()}</StrictMode>))
  expect(instance()).toBe(original)
  expect(initialized).toHaveBeenCalledTimes(initialCount)
  expect(activeSlide()).toBe('second')
  await act(async () => root.unmount())
  expect(destroyed).toHaveBeenCalledTimes(initialCount)
})
