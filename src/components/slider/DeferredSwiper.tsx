import { useRef, type CSSProperties, type PropsWithChildren } from 'react'
import Swiper from 'swiper'
import type { SwiperOptions } from 'swiper/types'
import {
  useBrowserLayoutEffect,
  useNearViewport
} from '../../utils/hooks/useNearViewport'
import styles from './DeferredSwiper.module.css'

export type DeferredSwiperProps = PropsWithChildren<SwiperOptions>

// CMS renders recreate plain option objects/arrays. Compare their values, while
// retaining identity semantics for callbacks, module functions and DOM nodes.
function sameOptions(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false
  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((value, index) => sameOptions(value, b[index]))
    )
  }
  const prototype: unknown = Object.getPrototypeOf(a)
  if (
    prototype !== Object.getPrototypeOf(b) ||
    (prototype !== Object.prototype && prototype !== null)
  )
    return false
  const left = a as Record<string, unknown>
  const right = b as Record<string, unknown>
  const keys = Object.keys(left)
  return (
    keys.length === Object.keys(right).length &&
    keys.every(
      (key) => Object.hasOwn(right, key) && sameOptions(left[key], right[key])
    )
  )
}

// Enhance the existing slide DOM rather than replacing it with a placeholder
// or remounting slide content when the carousel becomes visible.
export function DeferredSwiper(props: DeferredSwiperProps) {
  const { children, ...options } = props
  const { ref, isNear } = useNearViewport<HTMLDivElement>()
  const previous = useRef<HTMLDivElement>(null)
  const next = useRef<HTMLDivElement>(null)
  const pagination = useRef<HTMLDivElement>(null)
  const scrollbar = useRef<HTMLDivElement>(null)
  const instance = useRef<Swiper | null>(null)
  const previousRender = useRef<DeferredSwiperProps | null>(null)

  useBrowserLayoutEffect(() => {
    if (!isNear || !ref.current) return
    const { children, ...params } = props
    const { children: previousChildren, ...previousParams } =
      previousRender.current || {}
    const current = instance.current
    const activeSlide = current?.slides[current.activeIndex]
    const slides = Array.from(
      ref.current.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide')
    )
    const activePosition = activeSlide ? slides.indexOf(activeSlide) : -1
    const activeIndex = current
      ? current.params.loop
        ? current.realIndex
        : activePosition >= 0
          ? activePosition
          : Math.max(0, Math.min(current.activeIndex, slides.length - 1))
      : undefined

    previousRender.current = props
    if (current && sameOptions(previousParams, params)) {
      if (children !== previousChildren) {
        current.update()
        // Preserve the active DOM slide when React inserts/reorders keyed slides.
        if (!current.params.loop && activeIndex !== current.activeIndex) {
          current.slideTo(activeIndex, 0, false)
        }
      }
      return
    }

    // Genuine option/module changes require fresh setup. Keep the same slide
    // and DOM content; ordinary parent renders do not enter this branch.
    current?.destroy(true, true)
    instance.current = null
    const swiper = new Swiper(ref.current, {
      ...params,
      ...(activeIndex !== undefined && { initialSlide: activeIndex }),
      ...(params.navigation && {
        navigation: {
          ...(typeof params.navigation === 'object' ? params.navigation : {}),
          prevEl: previous.current,
          nextEl: next.current
        }
      }),
      ...(params.pagination && {
        pagination: {
          ...(typeof params.pagination === 'object' ? params.pagination : {}),
          el: pagination.current
        }
      }),
      ...(params.scrollbar && {
        scrollbar: {
          ...(typeof params.scrollbar === 'object' ? params.scrollbar : {}),
          el: scrollbar.current
        }
      })
    })
    instance.current = swiper
  }, [isNear, props, ref])

  useBrowserLayoutEffect(() => {
    return () => {
      instance.current?.destroy(true, true)
      instance.current = null
      previousRender.current = null
    }
  }, [])

  const singleSlideEffect =
    !!options.effect &&
    options.effect !== 'slide' &&
    options.effect !== 'coverflow'
  const sizing = (breakpoint?: number) => {
    const config = breakpoint ? options.breakpoints?.[breakpoint] : undefined
    const count = config?.slidesPerView ?? options.slidesPerView
    const gap = config?.spaceBetween ?? options.spaceBetween ?? 0
    return {
      count: singleSlideEffect || typeof count !== 'number' ? 1 : count,
      gap: singleSlideEffect
        ? '0px'
        : typeof gap === 'number'
          ? `${gap}px`
          : gap
    }
  }
  const mobile = sizing()
  const tablet = sizing(600)
  const desktop = sizing(900)
  const style = {
    '--lm-slides-mobile': mobile.count,
    '--lm-gap-mobile': mobile.gap,
    '--lm-slides-tablet': tablet.count,
    '--lm-gap-tablet': tablet.gap,
    '--lm-slides-desktop': desktop.count,
    '--lm-gap-desktop': desktop.gap
  } as CSSProperties

  return (
    <div ref={ref} className={`swiper ${styles.root}`} style={style}>
      <div className="swiper-wrapper">{children}</div>
      {options.navigation && (
        <>
          <div ref={previous} className="swiper-button-prev" />
          <div ref={next} className="swiper-button-next" />
        </>
      )}
      {options.scrollbar && (
        <div ref={scrollbar} className="swiper-scrollbar" />
      )}
      {options.pagination && (
        <div ref={pagination} className="swiper-pagination" />
      )}
    </div>
  )
}
