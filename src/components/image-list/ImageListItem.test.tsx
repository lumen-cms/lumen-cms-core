import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import Item from './ImageListItem'
import type { LmImageListItemProps } from './imageListTypes'
const seen = vi.hoisted(() => ({
  image: {} as Record<string, any>,
  bar: {} as Record<string, any>
}))
vi.mock('next/image', () => ({
  default: (props: Record<string, any>) => {
    seen.image = props
    return <span data-image />
  }
}))
vi.mock('@mui/material/ImageListItemBar', () => ({
  default: (props: Record<string, any>) => {
    seen.bar = props
    return <span data-bar />
  }
}))
vi.mock('../../utils/imageServices', () => ({
  getRootImageUrl: (s: string) => s,
  getOriginalImageDimensions: () => ({ width: 800, height: 600 }),
  getVwByColCount: (n: number | string) => 100 / Number(n)
}))
vi.mock('../../utils/storyblokImageLoader', () => ({
  storyblokImageLoader: () => ({ unoptimized: true })
}))
const content = {
  _uid: 'image',
  component: 'image_list_item',
  source: 'https://example.com/image.jpg',
  label: 'Caption'
} as LmImageListItemProps['content']
const listProps = {
  _uid: 'list',
  component: 'image_list',
  aspect_ratio: '1x1'
} as LmImageListItemProps['listProps']
function render(
  overrides: Partial<LmImageListItemProps['listProps']> = {},
  item: Partial<LmImageListItemProps['content']> = {}
) {
  return renderToStaticMarkup(
    <Item
      content={{ ...content, ...item }}
      listProps={{ ...listProps, ...overrides }}
      inView
    />
  )
}
it('preserves intrinsic dimensions, loader, default sizes and alt fallback', () => {
  render()
  expect(seen.image).toMatchObject({
    width: 800,
    height: 600,
    alt: 'Caption',
    unoptimized: true,
    placeholder: 'empty',
    className: 'MuiImageListItem-img'
  })
  expect(seen.image.sizes).toBe(
    '(min-width: 0) and (max-width: 599px) 100vw, (min-width: 600px) and (max-width: 899px): 33.333333333333336vw, 25vw'
  )
  render(
    { column_count: '4', column_count_phone: '2', column_count_tablet: '5' },
    { alt: 'Explicit' }
  )
  expect(seen.image.alt).toBe('Explicit')
  expect(seen.image.sizes).toContain('50vw')
  expect(seen.image.sizes).toContain('20vw')
  render({}, { alt: '', label: '' })
  expect(seen.image.alt).toBe('image list item')
})
it('preserves fit-color wrapping and masonry/aspect-ratio exceptions', () => {
  expect(render({ fit_in_color: '#123456' })).toContain(
    'background-color:#123456'
  )
  expect(seen.image.style.objectFit).toBe('contain')
  for (const overrides of [
    { masonry: true },
    { variant: 'masonry' as const },
    { aspect_ratio: undefined }
  ])
    expect(render({ fit_in_color: '#123456', ...overrides })).not.toContain(
      'background-color:#123456'
    )
  render()
  expect(seen.image.style.objectFit).toBeUndefined()
  render({ aspect_ratio: undefined })
  expect(seen.image.style.objectFit).toBe('contain')
})
it('preserves caption precedence and missing image/caption handling', () => {
  render({ label_position: 'top' }, { label_position: 'below' })
  expect(seen.bar.position).toBe('below')
  render({ label_position: 'top' })
  expect(seen.bar.position).toBe('top')
  render()
  expect(seen.bar.position).toBe('bottom')
  const html = render({}, { source: '', label: '', sub_title: '' })
  expect(html).not.toContain('data-image')
  expect(html).not.toContain('data-bar')
  render({}, { label: '', sub_title: 'Subtitle' })
  expect(seen.bar.subtitle).toBe('Subtitle')
})
