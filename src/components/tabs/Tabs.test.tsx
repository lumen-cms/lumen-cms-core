// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Tabs from './Tabs'
const fixture = vi.hoisted(() => ({
  mobile: false,
  list: {} as any,
  carousel: {} as any
}))
vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => fixture.mobile
}))
vi.mock('../../vendor/grid', () => ({
  default: ({ children, sm }: any) => (
    <div data-width={sm === undefined ? undefined : String(sm)}>{children}</div>
  )
}))
vi.mock('@mui/lab/TabContext', () => ({
  default: ({ children, value }: any) => (
    <div data-active={value}>{children}</div>
  )
}))
vi.mock('@mui/lab/TabList', () => ({
  default: ({ children, ...props }: any) => {
    fixture.list = props
    return <div>{children}</div>
  }
}))
vi.mock('@mui/material/Tab', () => ({
  default: ({ label, icon }: any) => (
    <div>
      {icon}
      {label}
    </div>
  )
}))
vi.mock('@mui/lab/TabPanel', () => ({
  default: ({ children, value }: any) => (
    <div data-panel={value}>{children}</div>
  )
}))
vi.mock('../slider/LmNukaCarousel', () => ({
  default: ({ children, ...props }: any) => {
    fixture.carousel = props
    return <div>{children}</div>
  }
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: any) => (
    <span>{content.text || content._uid}</span>
  )
}))
vi.mock('../icon/LmIcon', () => ({
  default: ({ iconName }: any) => <span>{iconName}</span>
}))
it.each([false, true])(
  'preserves tab/carousel coordination and responsive layout (styled labels: %s)',
  async (styled) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    fixture.mobile = false
    const host = document.createElement('div'),
      root = createRoot(host)
    const content = {
      _uid: 'tabs',
      component: 'tabs',
      vertical_tabs: true,
      tabs_width: '3',
      content_width: '9',
      centered: true,
      dynamic_height: true,
      text_style: styled ? [{ _uid: 'style', component: 'headline' }] : [],
      body: [
        {
          _uid: 'first',
          component: 'tabs_item',
          title: 'First',
          icon: { name: 'Star' },
          body: [{ _uid: 'first-body', component: 'paragraph' }]
        },
        {
          _uid: 'second',
          component: 'tabs_item',
          title: 'Second',
          body: [{ _uid: 'second-body', component: 'paragraph' }]
        }
      ]
    } as any
    try {
      await act(async () => root.render(<Tabs content={content} />))
      expect(fixture.list.orientation).toBe('vertical')
      expect(fixture.list.centered).toBe(true)
      expect(fixture.list.variant).toBe('fullWidth')
      expect(host.querySelector('[data-width="3"]')).not.toBeNull()
      expect(host.querySelector('[data-width="9"]')).not.toBeNull()
      expect(host.textContent).toContain('StarFirstSecond')
      expect(fixture.carousel.adaptiveHeight).toBe(true)
      await act(async () => fixture.list.onChange(null, '1'))
      expect(
        host.querySelector('[data-active]')?.getAttribute('data-active')
      ).toBe('1')
      expect(fixture.carousel.slideIndex).toBe(1)
      fixture.mobile = true
      await act(async () => root.render(<Tabs content={{ ...content }} />))
      expect(fixture.list.orientation).toBe('horizontal')
      expect(fixture.list.variant).toBe('scrollable')
      expect(fixture.list.centered).toBe(false)
      expect(host.querySelectorAll('[data-width="12"]')).toHaveLength(2)
      expect(fixture.carousel.slideIndex).toBe(1)
      await act(async () => fixture.carousel.beforeSlide(1, 0))
      expect(
        host.querySelector('[data-active]')?.getAttribute('data-active')
      ).toBe('0')
    } finally {
      await act(async () => root.unmount())
    }
  }
)
