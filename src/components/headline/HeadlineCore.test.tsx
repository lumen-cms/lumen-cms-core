import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import type { CSSProperties, PropsWithChildren } from 'react'
import { LmHeadlineCore } from './HeadlineCore'
import styles from './HeadlineCore.module.css'

vi.mock('@mui/material/Typography', () => ({
  default: ({
    style,
    className,
    children
  }: PropsWithChildren<{ style?: CSSProperties; className?: string }>) => (
    <span className={className} style={style}>
      {children}
    </span>
  )
}))

it('combines the compatibility class with the existing inline clamp styles', () => {
  const markup = renderToStaticMarkup(
    <LmHeadlineCore
      content={{ component: 'headline', _uid: 'headline', max_lines: '3' }}
    >
      Three lines
    </LmHeadlineCore>
  )
  expect(markup).toContain('-webkit-line-clamp:3')
  expect(markup).toContain('text-overflow:ellipsis')
  expect(markup).toContain('overflow:hidden')
  expect(markup).toContain('display:-webkit-box')
  expect(markup).toContain(styles.clamped)
})

it('does not add clamp styles without a line limit', () => {
  const markup = renderToStaticMarkup(
    <LmHeadlineCore content={{ component: 'headline', _uid: 'headline' }}>
      Unlimited
    </LmHeadlineCore>
  )
  expect(markup).not.toContain('-webkit-line-clamp')
  expect(markup).not.toContain('-webkit-box-orient')
  expect(markup).not.toContain(styles.clamped)
})
