// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmImageList from './ImageList'
import type { LmImageListProps } from './imageListTypes'

const observed = vi.hoisted(() => ({
  list: {} as Record<string, any>,
  item: {} as Record<string, any>,
  lightbox: {} as Record<string, any>
}))
vi.mock('@mui/material/ImageList', () => ({
  default: ({ children, ...props }: { children: ReactNode }) => {
    observed.list = props
    return <ul>{children}</ul>
  }
}))
vi.mock('@mui/material/ImageListItem', () => ({
  default: ({
    children,
    ...props
  }: {
    children: ReactNode
    onClick?: () => void
  }) => {
    observed.item = props
    return (
      <li>
        <button onClick={props.onClick}>{children}</button>
      </li>
    )
  }
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: () => <span>Image</span>
}))
vi.mock('../../utils/config', () => ({
  LmCoreComponents: { lm_link_render: 'a' }
}))
vi.mock('../../utils/linkHandler', () => ({
  getLinkAttrs: () => ({ href: '/target' })
}))
vi.mock('next/dynamic', () => ({
  default: () => (props: Record<string, any>) => {
    observed.lightbox = props
    return (
      <button data-close onClick={() => props.setLightbox('')}>
        Close
      </button>
    )
  }
}))

const content = {
  _uid: 'gallery',
  component: 'image_list',
  body: [
    {
      _uid: 'image',
      component: 'image_list_item',
      cols: '2',
      rows: '3',
      link: { cached_url: 'target' }
    }
  ]
} as unknown as LmImageListProps['content']
async function renderCase(
  test: (
    root: ReturnType<typeof createRoot>,
    host: HTMLDivElement
  ) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  try {
    await test(root, host)
  } finally {
    await act(async () => root.unmount())
  }
}
it.each([false, true])(
  'preserves default and overridden responsive columns (masonry: %s)',
  async (masonry) => {
    await renderCase(async (root, host) => {
      await act(async () =>
        root.render(
          <LmImageList content={{ ...content, masonry, aspect_ratio: '1x1' }} />
        )
      )
      expect(observed.list.variant).toBe(masonry ? 'masonry' : 'standard')
      expect(observed.list.gap).toBe(2)
      expect(observed.list.rowHeight).toBe('auto')
      expect(
        observed.list.sx[masonry ? 'columnCount' : 'gridTemplateColumns']
      ).toEqual(
        masonry
          ? { xs: '2!important', sm: '3!important', lg: '4!important' }
          : {
              xs: 'repeat(1, 1fr)!important',
              sm: 'repeat(3, 1fr)!important',
              lg: 'repeat(4, 1fr)!important'
            }
      )
      expect(host.querySelector('.ratio-1x1') !== null).toBe(!masonry)
      await act(async () =>
        root.render(
          <LmImageList
            content={{
              ...content,
              masonry,
              column_count: '6',
              column_count_phone: '2',
              column_count_tablet: '4',
              column_gap: '0',
              row_height: '100'
            }}
          />
        )
      )
      expect(
        observed.list.sx[masonry ? 'columnCount' : 'gridTemplateColumns']
      ).toEqual(
        masonry
          ? { xs: '2!important', sm: '4!important', lg: '6!important' }
          : {
              xs: 'repeat(2, 1fr)!important',
              sm: 'repeat(4, 1fr)!important',
              lg: 'repeat(6, 1fr)!important'
            }
      )
      expect(observed.list.gap).toBe(0)
      expect(observed.list.rowHeight).toBe(100)
    })
  }
)
it('preserves link navigation, lightbox ownership, item dimensions and closing', async () => {
  await renderCase(async (root, host) => {
    await act(async () => root.render(<LmImageList content={content} />))
    expect(observed.item.href).toBe('/target')
    expect(observed.item.component).toBe('a')
    expect(observed.item.cols).toBe(2)
    expect(observed.item.rows).toBe(3)
    await act(async () => host.querySelector('button')!.click())
    expect(host.querySelector('[data-close]')).toBeNull()
    await act(async () =>
      root.render(
        <LmImageList content={{ ...content, enable_lightbox: true }} />
      )
    )
    expect(observed.item.href).toBeUndefined()
    await act(async () => host.querySelector('button')!.click())
    expect(observed.lightbox.lightbox).toBe('image')
    expect(observed.lightbox.elements).toBe(content.body)
    await act(async () =>
      root.render(
        <LmImageList
          content={{ ...content, enable_lightbox: true, column_count: '6' }}
        />
      )
    )
    expect(host.querySelector('[data-close]')).not.toBeNull()
    await act(async () =>
      (host.querySelector('[data-close]') as HTMLButtonElement).click()
    )
    expect(host.querySelector('[data-close]')).toBeNull()
  })
})
it('keeps explicit variant precedence and handles empty galleries', async () => {
  await renderCase(async (root) => {
    await act(async () =>
      root.render(
        <LmImageList
          content={{
            ...content,
            body: undefined,
            masonry: true,
            variant: 'woven'
          }}
        />
      )
    )
    expect(observed.list.variant).toBe('woven')
    expect(observed.list.sx.columnCount).toBeDefined()
  })
})
