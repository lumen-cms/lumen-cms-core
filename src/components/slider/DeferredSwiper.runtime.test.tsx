// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar
} from 'swiper/modules'
import { expect, it, vi } from 'vitest'
import { DeferredSwiper } from './DeferredSwiper'

it('initializes real Swiper with omitted modules options and scopes working navigation to its own slides', async () => {
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
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  try {
    await act(async () =>
      root.render(
        <DeferredSwiper
          modules={[A11y, Autoplay, Navigation, Pagination, Scrollbar]}
          navigation={{ addIcons: false }}
          speed={0}
        >
          <div className="swiper-slide">First</div>
          <div className="swiper-slide">Second</div>
        </DeferredSwiper>
      )
    )
    expect(host.querySelector('.swiper-initialized')).not.toBeNull()
    expect(host.querySelector('.swiper-slide-active')?.textContent).toBe(
      'First'
    )
    await act(async () =>
      host.querySelector<HTMLElement>('.swiper-button-next')!.click()
    )
    expect(host.querySelector('.swiper-slide-active')?.textContent).toBe(
      'Second'
    )
  } finally {
    await act(async () => root.unmount())
    host.remove()
  }
})
