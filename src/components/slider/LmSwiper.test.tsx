import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import LmSwiper from './LmSwiper'
import { LmCoreComponents } from '../../utils/config'

vi.mock('../../utils/config', () => ({ LmCoreComponents: {} }))

vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <div>Slide content {content._uid}</div>
  )
}))

it('renders CMS slide content without a browser so slow JavaScript cannot remove it from the initial HTML', () => {
  const html = renderToStaticMarkup(
    <LmSwiper
      content={{
        _uid: 'server-carousel',
        component: 'swiper',
        slides_per_view: '1,2,4',
        body: ['deadline', 'logo'].map((_uid) => ({
          _uid,
          component: 'swiper_item'
        }))
      }}
    />
  )
  expect(html).toContain('swiper-slide')
  expect(html).toContain('Slide content deadline')
  expect(html).toContain('Slide content logo')
})

it('keeps server rendering enabled in the lazy CMS registry', async () => {
  await import('../LazyNamedComponents')
  const RegisteredSwiper = LmCoreComponents.swiper as typeof LmSwiper & {
    render: { preload: () => Promise<unknown> }
  }
  // The Pages Router's loadable render function exposes the preload hook used
  // during SSR. Exercise the actual registry, so ssr:false fails this test too.
  await RegisteredSwiper.render.preload()
  const html = renderToStaticMarkup(
    <RegisteredSwiper
      content={{
        _uid: 'registered-carousel',
        component: 'swiper',
        body: [{ _uid: 'deadline', component: 'swiper_item' }]
      }}
    />
  )
  expect(html).toContain('Slide content deadline')
})
