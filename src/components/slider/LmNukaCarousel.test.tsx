import { expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import LmNukaCarousel from './LmNukaCarousel'

it('renders slides on React 19 with the original carousel defaults', () => {
  const html = renderToStaticMarkup(
    <LmNukaCarousel renderAnnounceSlideMessage={undefined}>
      <div>First slide</div>
      <div>Second slide</div>
    </LmNukaCarousel>
  )
  expect(html).toContain('First slide')
  expect(html).toContain('Second slide')
  expect(html).toContain('aria-live="polite"')
})
