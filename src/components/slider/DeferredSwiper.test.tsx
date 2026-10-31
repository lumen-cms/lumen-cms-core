import type { SwiperOptions } from 'swiper/types'
// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { DeferredSwiper } from './DeferredSwiper'

const runtime = vi.hoisted(() => ({
  create: vi.fn<(element: HTMLElement, options: SwiperOptions) => void>(),
  destroy: vi.fn()
}))
vi.mock('swiper', () => ({
  default: class {
    constructor(element: HTMLElement, options: SwiperOptions) {
      runtime.create(element, options)
    }
    destroy = runtime.destroy
  }
}))

let root: Root
let host: HTMLDivElement
let top: number
let enter: IntersectionObserverCallback
const disconnect = vi.fn()
const observe = vi.fn()

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  runtime.create.mockClear()
  runtime.destroy.mockClear()
  disconnect.mockClear()
  observe.mockClear()
  top = 3000
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () =>
      ({
        top,
        bottom: top + 200,
        left: 0,
        right: 400,
        width: 400,
        height: 200
      }) as DOMRect
  )
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        callback: IntersectionObserverCallback,
        options: IntersectionObserverInit
      ) {
        enter = callback
        expect(options.rootMargin).toBe('400px 0px')
      }
      observe = observe
      disconnect = disconnect
    }
  )
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

function Carousel() {
  return (
    <DeferredSwiper
      navigation={{ addIcons: false }}
      pagination={{ clickable: true }}
    >
      <div className="swiper-slide">
        <input defaultValue="slide content" />
      </div>
    </DeferredSwiper>
  )
}

it('renders slides and controls on the server without initializing Swiper', () => {
  const html = renderToStaticMarkup(<Carousel />)
  expect(html).toContain('slide content')
  expect(html).toContain('swiper-button-next')
  expect(runtime.create).not.toHaveBeenCalled()
})

it('waits offscreen, enhances the same DOM near the viewport, and cleans up', async () => {
  await act(async () => root.render(<Carousel />))
  expect(runtime.create).not.toHaveBeenCalled()
  const slide = host.querySelector('.swiper-slide')
  const input = host.querySelector('input')!
  input.value = 'preserve local state'
  await act(async () =>
    enter(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )
  )
  expect(runtime.create).toHaveBeenCalledTimes(1)
  expect(host.querySelector('.swiper-slide')).toBe(slide)
  expect(host.querySelector('input')).toBe(input)
  expect(input.value).toBe('preserve local state')
  const options = runtime.create.mock.calls[0][1]
  if (
    typeof options.navigation !== 'object' ||
    typeof options.pagination !== 'object'
  ) {
    throw new Error('Expected configured navigation and pagination options')
  }
  expect(options.navigation.prevEl).toBe(
    host.querySelector('.swiper-button-prev')
  )
  expect(options.navigation.nextEl).toBe(
    host.querySelector('.swiper-button-next')
  )
  expect(options.pagination.el).toBe(host.querySelector('.swiper-pagination'))
  expect(options.pagination.clickable).toBe(true)
  expect(disconnect).toHaveBeenCalled()
  await act(async () => root.unmount())
  expect(runtime.destroy).toHaveBeenCalledTimes(1)
})

it.each([0, 200, 1100])(
  'initializes a visible or nearby carousel immediately at y=%i',
  async (position) => {
    top = position
    vi.stubGlobal('innerHeight', 800)
    await act(async () => root.render(<Carousel />))
    expect(runtime.create).toHaveBeenCalledTimes(1)
    expect(observe).not.toHaveBeenCalled()
  }
)

it('falls back to immediate initialization without IntersectionObserver', async () => {
  vi.stubGlobal('IntersectionObserver', undefined)
  await act(async () => root.render(<Carousel />))
  expect(runtime.create).toHaveBeenCalledTimes(1)
})

it('does not initialize an offscreen carousel in StrictMode or after unmount', async () => {
  await act(async () =>
    root.render(
      <StrictMode>
        <Carousel />
      </StrictMode>
    )
  )
  expect(runtime.create).not.toHaveBeenCalled()
  await act(async () => root.unmount())
  expect(disconnect).toHaveBeenCalled()
})
