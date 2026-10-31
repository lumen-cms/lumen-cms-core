import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode, ComponentProps, CSSProperties } from 'react'
import type { Theme } from '@mui/material/styles'
import type Container from './LmSwiperContainer'
type BoxCapture = {
  children?: ReactNode
  sx: {
    '--swiper-theme-color': (theme: Theme) => unknown
    '& .swiper': CSSProperties
  }
}
import { expect, it, vi } from 'vitest'
import Swiper from './LmSwiper'
import type { LmSwiperProps } from './sliderTypes'
const seen = vi.hoisted(() => ({
  props: {} as ComponentProps<typeof Container>,
  box: {} as BoxCapture
}))
vi.mock('./LmSwiperContainer', () => ({
  default: ({ children, ...p }: ComponentProps<typeof Container>) => {
    seen.props = p
    return <div>{children}</div>
  }
}))
vi.mock('@mui/material/Box', () => ({
  default: ({ children, ...p }: BoxCapture) => {
    seen.box = p
    return <div>{children}</div>
  }
}))
vi.mock('swiper/react', () => ({
  SwiperSlide: ({ children }: { children: ReactNode }) => (
    <section>{children}</section>
  )
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <span>{content._uid}</span>
  )
}))
vi.mock('../../utils/themeColor', () => ({
  getThemeColor: () => 'custom-color'
}))
const content = {
  _uid: 'slider',
  component: 'swiper',
  body: [
    { _uid: 'one', component: 'swiper_item' },
    { _uid: 'two', component: 'swiper_item' }
  ]
} as LmSwiperProps['content']
function render(overrides: Partial<LmSwiperProps['content']> = {}) {
  return renderToStaticMarkup(<Swiper content={{ ...content, ...overrides }} />)
}
it('preserves default configuration and slide order', () => {
  const html = render()
  expect(seen.props.swiperProps).toMatchObject({
    navigation: { addIcons: false },
    pagination: { clickable: true, dynamicBullets: false },
    slidesPerView: 1,
    spaceBetween: 0,
    breakpoints: {
      600: { slidesPerView: 1, spaceBetween: 0 },
      900: { slidesPerView: 1, spaceBetween: 0 }
    }
  })
  expect(seen.props.swiperProps.modules).toHaveLength(5)
  expect(seen.props.swiperProps.autoplay).toBeUndefined()
  expect(html.indexOf('one')).toBeLessThan(html.indexOf('two'))
  expect(
    seen.box.sx['--swiper-theme-color']({
      palette: { text: { primary: 'default' } }
    } as Theme)
  ).toBe('default')
})
it('preserves flags, autoplay and responsive zero-value fallback', () => {
  render({
    property: ['free_mode', 'grab_cursor', 'hide_arrows', 'hide_pagination'],
    autoslide_duration: '2500',
    pause_on_hover: true,
    slides_per_view: '2,0,4',
    space_between_slides: '10,0,30'
  })
  expect(seen.props.swiperProps).toMatchObject({
    navigation: false,
    freeMode: true,
    grabCursor: true,
    autoplay: { delay: 2500, pauseOnMouseEnter: true },
    breakpoints: {
      600: { slidesPerView: 2, spaceBetween: 10 },
      900: { slidesPerView: 4, spaceBetween: 30 }
    }
  })
  expect(seen.props.swiperProps.pagination).toBeUndefined()
})
it('preserves effect-specific sizing, pagination and style overrides', () => {
  render({
    effect: 'cube',
    slides_per_view: '2,3,4',
    max_pagination_bullets: '5',
    height: '200',
    width: '400',
    theme_color: 'primary.main',
    navigation_size: '30',
    pagination_bullet_size: '10'
  })
  expect(seen.props.effect).toBe('cube')
  expect(seen.props.swiperProps.breakpoints).toBeUndefined()
  expect(seen.props.swiperProps.slidesPerView).toBeUndefined()
  expect(seen.props.swiperProps.pagination).toMatchObject({
    dynamicMainBullets: 5,
    dynamicBullets: true
  })
  expect(seen.box.sx['& .swiper']).toEqual({ height: '200px', width: '400px' })
  expect(seen.box.sx['--swiper-theme-color']({} as Theme)).toBe('custom-color')
  render({ effect: 'fade', slides_per_view: '2,3' })
  expect(seen.props.swiperProps.breakpoints![900].slidesPerView).toBe(3)
})
