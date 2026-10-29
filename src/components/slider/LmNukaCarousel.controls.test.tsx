// @vitest-environment happy-dom
import { act, useEffect, useRef, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Carousel from './LmNukaCarousel'
const seen = vi.hoisted(() => ({
  props: {} as Record<string, any>,
  instance: {
    destroyed: false,
    realIndex: 0,
    isBeginning: true,
    isEnd: false,
    slidePrev: vi.fn(),
    slideNext: vi.fn(),
    slideTo: vi.fn(),
    slideToLoop: vi.fn()
  }
}))
vi.mock('swiper/react', () => ({
  Swiper: ({
    children,
    ...p
  }: {
    children: ReactNode
    onSwiper: (i: unknown) => void
  }) => {
    seen.props = p
    const onSwiper = useRef(p.onSwiper)
    useEffect(() => onSwiper.current(seen.instance), [])
    return <div>{children}</div>
  },
  SwiperSlide: ({ children }: { children: ReactNode }) => (
    <section>{children}</section>
  )
}))
async function check(
  test: (
    render: (props?: Partial<Parameters<typeof Carousel>[0]>) => Promise<void>,
    host: HTMLDivElement
  ) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  Object.assign(seen.instance, {
    realIndex: 0,
    isBeginning: true,
    isEnd: false
  })
  for (const name of [
    'slidePrev',
    'slideNext',
    'slideTo',
    'slideToLoop'
  ] as const)
    seen.instance[name].mockClear()
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (
    props: Partial<Parameters<typeof Carousel>[0]> = {}
  ) => {
    await act(async () =>
      root.render(
        <Carousel {...props}>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </Carousel>
      )
    )
  }
  try {
    await test(render, host)
  } finally {
    await act(async () => root.unmount())
  }
}
it('preserves non-loop edge disabling, navigation, pagination and callbacks', async () =>
  check(async (render, host) => {
    const before = vi.fn(),
      after = vi.fn()
    await render({ wrapAround: false, beforeSlide: before, afterSlide: after })
    expect(
      (host.querySelector('[aria-label="previous slide"]') as HTMLButtonElement)
        .disabled
    ).toBe(true)
    await act(async () =>
      (
        host.querySelector('[aria-label="next slide"]') as HTMLButtonElement
      ).click()
    )
    expect(seen.instance.slideNext).toHaveBeenCalledOnce()
    await act(async () =>
      (
        host.querySelector('[aria-label="slide 3"]') as HTMLButtonElement
      ).click()
    )
    expect(seen.instance.slideTo).toHaveBeenCalledWith(2)
    Object.assign(seen.instance, {
      realIndex: 2,
      isBeginning: false,
      isEnd: true
    })
    await act(async () => seen.props.onRealIndexChange(seen.instance))
    expect(before).toHaveBeenCalledWith(0, 2)
    expect(
      (host.querySelector('[aria-label="next slide"]') as HTMLButtonElement)
        .disabled
    ).toBe(true)
    await act(async () => seen.props.onSlideChangeTransitionEnd(seen.instance))
    expect(after).toHaveBeenCalledWith(2)
    await act(async () =>
      (
        host.querySelector('[aria-label="previous slide"]') as HTMLButtonElement
      ).click()
    )
    expect(seen.instance.slidePrev).toHaveBeenCalledOnce()
  }))
it('preserves looping, controlled selection and autoplay settings', async () =>
  check(async (render, host) => {
    await render({
      autoplay: true,
      autoplayInterval: 1500,
      pauseOnHover: false,
      disableAnimation: true,
      adaptiveHeight: true
    })
    expect(seen.props).toMatchObject({
      loop: true,
      speed: 0,
      autoHeight: true,
      autoplay: {
        delay: 1500,
        pauseOnMouseEnter: false,
        disableOnInteraction: false
      }
    })
    await act(async () =>
      (
        host.querySelector('[aria-label="slide 2"]') as HTMLButtonElement
      ).click()
    )
    expect(seen.instance.slideToLoop).toHaveBeenCalledWith(1)
    await render({ slideIndex: 2 })
    expect(seen.instance.slideToLoop).toHaveBeenCalledWith(2)
    await render({ slidesToShow: 3 })
    expect(seen.props.loop).toBe(false)
  }))
it('preserves indicator selection and hiding controls', async () =>
  check(async (render, host) => {
    await render({
      paginationCircle: true,
      hideArrows: true,
      darkPagination: true,
      paginationBelowContent: true,
      arrowsBesidePagination: true
    })
    expect(host.querySelector('[aria-label="previous slide"]')).toBeNull()
    const first = host.querySelector('[aria-label="slide 1"] svg')!.innerHTML
    Object.assign(seen.instance, { realIndex: 1 })
    await act(async () => seen.props.onRealIndexChange(seen.instance))
    expect(host.querySelector('[aria-label="slide 2"] svg')!.innerHTML).toBe(
      first
    )
    expect(
      host.querySelector('[aria-label="slide 1"] svg')!.innerHTML
    ).not.toBe(first)
    await render({ withoutControls: true })
    expect(host.querySelector('button')).toBeNull()
    expect(host.textContent).toBe('FirstSecondThird')
  }))

it('keeps keyed slide inputs and pagination nodes with their slide after a reorder', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (ids: string[]) => {
    await act(async () =>
      root.render(
        <Carousel wrapAround={false}>
          {ids.map((id) => (
            <input key={id} aria-label={id} defaultValue={id} />
          ))}
        </Carousel>
      )
    )
  }
  try {
    await render(['a', 'b'])
    const input = host.querySelector('input')!,
      dot = host.querySelector('[aria-label="slide 1"]')!
    input.value = 'edited'
    await render(['b', 'a'])
    expect(host.querySelectorAll('input')[1]).toBe(input)
    expect(input.value).toBe('edited')
    expect(host.querySelector('[aria-label="slide 2"]')).toBe(dot)
    await act(async () => (dot as HTMLButtonElement).click())
    expect(seen.instance.slideTo).toHaveBeenLastCalledWith(1)
  } finally {
    await act(async () => root.unmount())
  }
})
