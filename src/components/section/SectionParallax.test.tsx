// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import SectionParallax from './SectionParallax'
import type { LmSectionParallaxProps } from './sectionTypes'

const controller = vi.hoisted(() => ({
  createElement: vi.fn(() => ({ id: 1 })),
  removeElementById: vi.fn(),
  resetElementStyles: vi.fn()
}))
vi.mock('react-scroll-parallax', () => ({
  useParallaxController: () => controller
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: () => <input defaultValue="Parallax content" />
}))
vi.mock('next/image', () => ({
  default: ({
    priority,
    loading,
    fetchPriority
  }: {
    priority: boolean
    loading?: 'eager'
    fetchPriority?: 'high' | 'low'
  }) => (
    <span
      data-image-probe
      data-priority={String(priority)}
      data-loading={loading}
      data-fetch-priority={fetchPriority}
    />
  )
}))
const content: LmSectionParallaxProps['content'] = {
  _uid: 'banner',
  component: 'section_parallax',
  height: '60',
  elements: [
    {
      _uid: 'layer',
      component: 'parallax_item',
      speed: '10',
      children: [
        { _uid: 'text', component: 'headline', text: 'Visible content' }
      ]
    }
  ]
}
let root: Root
let host: HTMLDivElement
let top: number
let enter: IntersectionObserverCallback
const disconnect = vi.fn()

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.clearAllMocks()
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
      constructor(callback: IntersectionObserverCallback) {
        enter = callback
      }
      observe() {}
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

it('renders layer content and expanded edges in the initial HTML', () => {
  const html = renderToStaticMarkup(<SectionParallax content={content} />)
  expect(html).toContain('Parallax content')
  expect(html).toContain('top:-100px')
  expect(html).toContain('bottom:-100px')
  expect(controller.createElement).not.toHaveBeenCalled()
})

it('keeps eager image loading separate from first-section preloading', () => {
  const withImage = {
    ...content,
    disable_lazy_load: true,
    elements: [
      {
        ...content.elements![0],
        image: '//a.storyblok.com/f/1/100x100/test.png'
      }
    ]
  }
  const below = renderToStaticMarkup(
    <SectionParallax content={withImage} sectionPosition={5} />
  )
  expect(below).toContain('data-loading="eager"')
  expect(below).toContain('data-priority="false"')
  expect(below).toContain('data-fetch-priority="low"')
  const hero = renderToStaticMarkup(
    <SectionParallax content={withImage} sectionPosition={0} />
  )
  expect(hero).toContain('data-priority="true"')
  expect(hero).toContain('data-fetch-priority="high"')
})

it('registers offscreen layers only on approach, preserving DOM and values', async () => {
  await act(async () => root.render(<SectionParallax content={content} />))
  expect(controller.createElement).not.toHaveBeenCalled()
  const input = host.querySelector('input')!
  const layer = input.parentElement
  input.value = 'unchanged'
  await act(async () =>
    enter(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    )
  )
  expect(controller.createElement).toHaveBeenCalledTimes(1)
  expect(controller.createElement).toHaveBeenCalledWith({
    el: layer,
    props: expect.objectContaining({
      speed: 10,
      shouldDisableScalingTranslations: true,
      targetElement: layer?.parentElement
    }) as unknown
  })
  expect(host.querySelector('input')).toBe(input)
  expect(input.value).toBe('unchanged')
  expect(disconnect).toHaveBeenCalled()
  await act(async () => root.unmount())
  expect(controller.removeElementById).toHaveBeenCalledWith(1)
  expect(controller.resetElementStyles).toHaveBeenCalled()
})

it('initializes above-the-fold layers without waiting for an observer callback', async () => {
  top = 0
  await act(async () =>
    root.render(<SectionParallax content={content} sectionPosition={0} />)
  )
  expect(controller.createElement).toHaveBeenCalledTimes(1)
})
