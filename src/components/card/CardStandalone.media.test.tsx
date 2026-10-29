import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import Card from './CardStandalone'
import type { LmCardStandaloneProps } from './cardTypes'
const seen = vi.hoisted(() => ({
  image: {} as Record<string, any>,
  media: {} as Record<string, any>
}))
vi.mock('next/image', () => ({
  default: (p: Record<string, any>) => {
    seen.image = p
    return <span>Media</span>
  }
}))
vi.mock('@mui/material/CardMedia', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.media = p
    return <div>{children}</div>
  }
}))
vi.mock('../section/useBackgroundBox', () => ({
  default: () => ({ className: '', style: {}, sx: [] })
}))
vi.mock('../section/BackgroundImage', () => ({ default: () => null }))
vi.mock('../section/BackgroundElements', () => ({ default: () => null }))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <span>{content._uid}</span>
  )
}))
const content = {
  _uid: 'card',
  component: 'card',
  media: { filename: 'https://example.com/image.jpg' },
  body_above_media: [{ _uid: 'above', component: 'headline' }],
  body: [{ _uid: 'body', component: 'headline' }],
  body_actions: [{ _uid: 'actions', component: 'button' }],
  body_on_hover: [{ _uid: 'hover', component: 'headline' }]
} as unknown as LmCardStandaloneProps['content']
it('preserves media defaults and content order', () => {
  const html = renderToStaticMarkup(<Card content={content} />)
  expect(seen.image).toMatchObject({
    fill: true,
    src: content.media!.filename,
    style: { objectFit: 'cover', objectPosition: 'center' },
    sizes: '300px',
    alt: 'card image'
  })
  expect(seen.media.sx.aspectRatio).toBe('3/2')
  const order = ['above', 'Media', 'body', 'actions', 'hover'].map((text) =>
    html.indexOf('>' + text + '<')
  )
  expect(order).toEqual([...order].sort((a, b) => a - b))
  expect(order.every((i) => i >= 0)).toBe(true)
})
it('preserves configured media size, crop, alt and margin', () => {
  renderToStaticMarkup(
    <Card
      content={
        {
          ...content,
          media: { ...content.media, alt: 'Caption' },
          media_max_width: '640',
          media_aspect_ratio: '1/1',
          object_fit: 'contain',
          object_position: 'top',
          media_margin: '2'
        } as LmCardStandaloneProps['content']
      }
    />
  )
  expect(seen.image).toMatchObject({
    sizes: '640px',
    alt: 'Caption',
    style: { objectFit: 'contain', objectPosition: 'top' }
  })
  expect(seen.media.sx.aspectRatio).toBe('1/1')
  expect(seen.media.sx.margin({ spacing: (n: number) => n * 8 })).toBe(16)
  const html = renderToStaticMarkup(
    <Card content={{ ...content, media: undefined }} />
  )
  expect(html).not.toContain('>Media<')
})
