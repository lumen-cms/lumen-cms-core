import { renderToStaticMarkup } from 'react-dom/server'
import type { PropsWithChildren } from 'react'
import { expect, it, vi } from 'vitest'
import FbqPixel from './FbqPixel'
const script = vi.hoisted(() => ({
  props: {} as {
    id: string
    strategy: string
    dangerouslySetInnerHTML: { __html: string }
  }
}))
vi.mock('next/head', () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>
}))
vi.mock('next/script', () => ({
  default: (props: typeof script.props) => {
    script.props = props
    return null
  }
}))
it('marks every hidden pixel decorative while preserving tracking requests and initialization', () => {
  const html = renderToStaticMarkup(<FbqPixel facebookPixelId="123, 456" />)
  expect(html.match(/alt=""/g)).toHaveLength(2)
  expect(html.match(/height="1" width="1"/g)).toHaveLength(2)
  expect(html.match(/display:none/g)).toHaveLength(2)
  expect(
    html.match(
      /https:\/\/www.facebook.com\/tr\?id=123, 456&amp;ev=PageView&amp;noscript=1/g
    )
  ).toHaveLength(2)
  expect(script.props.id).toBe('fbq-init')
  expect(script.props.strategy).toBe('afterInteractive')
  expect(script.props.dangerouslySetInnerHTML.__html).toContain(
    "fbq('init', '123');"
  )
  expect(script.props.dangerouslySetInnerHTML.__html).toContain(
    "fbq('init', '456');"
  )
  expect(script.props.dangerouslySetInnerHTML.__html).toContain(
    "fbq('track', 'PageView');"
  )
})
