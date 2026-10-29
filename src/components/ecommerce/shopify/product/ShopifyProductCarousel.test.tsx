import { renderToStaticMarkup } from 'react-dom/server'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { expect, it, vi } from 'vitest'
import { ShopifyProductCarousel } from './ShopifyProductCarousel'
import type { ShopifyProductItemProps } from '../shopifyTypes'
const fixture = vi.hoisted(() => ({
  config: {} as any,
  select: vi.fn(),
  carousel: {} as any
}))
vi.mock('../context/ShopifySdkContext', () => ({
  useShopifySdkContext: () => ({
    config: fixture.config,
    onVariantSelect: fixture.select
  })
}))
vi.mock('../../../slider/LmNukaCarousel', () => ({
  default: ({ children, ...props }: any) => {
    fixture.carousel = props
    return <div>{children}</div>
  }
}))
const item = {
  title: 'Product',
  variants: {
    edges: [
      {
        node: {
          id: 'one',
          title: 'First',
          image: { transformedSrc: '/product.png' }
        }
      },
      {
        node: {
          id: 'two',
          title: 'Second',
          image: { transformedSrc: '/second.png' }
        }
      }
    ]
  }
} as unknown as ShopifyProductItemProps['item']

it.each([
  [undefined, 50],
  ['3', 25],
  ['12', 100],
  ['auto', 100],
  ['true', 100]
])('uses layout-aware sizing for first-column width %s', (width, percent) => {
  fixture.config = { columns_first_width: width, image_container_height: '420' }
  const html = renderToStaticMarkup(<ShopifyProductCarousel item={item} />)
  expect(html).toContain(`sizes="(min-width:600px) ${percent}vw, 100vw"`)
  expect(html).toContain('object-fit:contain')
  expect(html).toContain('alt="First"')
  expect(html).toContain('srcSet=')
  expect(fixture.carousel.slideIndex).toBe(0)
  fixture.carousel.afterSlide(1)
  expect(fixture.select).toHaveBeenLastCalledWith({
    ...item.variants.edges[1].node,
    productTitle: 'Product'
  })
})
it('uses the actual theme breakpoint instead of assuming the default', () => {
  fixture.config = {}
  const theme = createTheme({
    ...createTheme(),
    breakpoints: { values: { xs: 0, sm: 700, md: 900, lg: 1200, xl: 1536 } }
  })
  const html = renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <ShopifyProductCarousel item={item} />
    </ThemeProvider>
  )
  expect(html).toContain('sizes="(min-width:700px) 50vw, 100vw"')
})
