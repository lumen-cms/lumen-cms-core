// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import LmNukaCarousel from './LmNukaCarousel'

it('renders every slide on the server with pagination dots', () => {
  const html = renderToStaticMarkup(
    <LmNukaCarousel>
      <div>First slide</div>
      <div>Second slide</div>
    </LmNukaCarousel>
  )
  expect(html).toContain('First slide')
  expect(html).toContain('Second slide')
  expect(html).toContain('aria-label="slide 2"')
  expect(html).toContain('aria-label="next slide"')
})

it('omits controls when requested', () => {
  const html = renderToStaticMarkup(
    <LmNukaCarousel withoutControls>
      <div>First slide</div>
      <div>Second slide</div>
    </LmNukaCarousel>
  )
  expect(html).not.toContain('aria-label="next slide"')
})

it('left-aligns slide content inside a centered parent while preserving explicit child alignment', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div')
  host.style.textAlign = 'center'
  document.body.append(host)
  const root = createRoot(host)
  await act(async () =>
    root.render(
      <LmNukaCarousel withoutControls wrapAround={false}>
        <div>
          <button>Apply Now</button>
          <div style={{ textAlign: 'right' }}>Explicit alignment</div>
        </div>
      </LmNukaCarousel>
    )
  )
  expect(getComputedStyle(host.querySelector('.swiper-slide')!).textAlign).toBe(
    'left'
  )
  expect(getComputedStyle(host.querySelector('button')!).textAlign).not.toBe(
    'center'
  )
  expect(
    getComputedStyle(host.querySelector('.swiper-slide div div')!).textAlign
  ).toBe('right')
  await act(async () => root.unmount())
  host.remove()
})

it('follows the controlled slide index and reports slide changes', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const beforeSlide = vi.fn()
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const render = (slideIndex: number) =>
    root.render(
      <LmNukaCarousel
        withoutControls
        disableAnimation
        slideIndex={slideIndex}
        beforeSlide={beforeSlide}
      >
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </LmNukaCarousel>
    )
  await act(async () => render(0))
  await act(async () => render(2))
  expect(beforeSlide).toHaveBeenLastCalledWith(0, 2)
  expect(host.querySelector('.swiper-slide-active')?.textContent).toBe('Third')
  await act(async () => root.unmount())
  host.remove()
})
