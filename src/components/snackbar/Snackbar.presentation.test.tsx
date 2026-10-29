// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Snackbar from './Snackbar'
import type { LmSnackbarProps } from './snackbarTypes'
const seen = vi.hoisted(() => ({
  dialog: {} as Record<string, any>,
  snack: {} as Record<string, any>,
  body: {} as Record<string, any>,
  preview: false,
  cookie: undefined as string | undefined
}))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ insideStoryblok: seen.preview })
}))
vi.mock('../../utils/hooks/useScrolledOnce', () => ({
  useScrollOnce: () => false
}))
vi.mock('js-cookie', () => ({
  default: { get: () => seen.cookie, set: vi.fn() }
}))
vi.mock('@mui/material', () => ({
  Dialog: ({ children, ...p }: { children: ReactNode }) => {
    seen.dialog = p
    return <div data-dialog>{children}</div>
  },
  DialogContent: ({ children }: { children: ReactNode }) => (
    <main>{children}</main>
  ),
  DialogActions: ({ children }: { children: ReactNode }) => (
    <footer>{children}</footer>
  )
}))
vi.mock('@mui/material/Snackbar', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.snack = p
    return <div>{children}</div>
  }
}))
vi.mock('@mui/material/SnackbarContent', () => ({
  default: (p: Record<string, any>) => {
    seen.body = p
    return (
      <div>
        {p.message}
        {p.action}
      </div>
    )
  }
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({
    content,
    onClick
  }: {
    content: { _uid: string; color?: string }
    onClick?: () => void
  }) => (
    <button data-color={content.color} onClick={onClick}>
      {content._uid}
    </button>
  )
}))
const content = {
  _uid: 'notice',
  component: 'snackbar',
  descriptions: [{ _uid: 'message', component: 'headline' }],
  additional_actions: [
    { _uid: 'extra', component: 'button', color: 'primary' }
  ],
  close_action: [{ _uid: 'accept', component: 'button' }]
} as unknown as LmSnackbarProps['content']
async function check(
  test: (
    render: (overrides?: Partial<LmSnackbarProps['content']>) => Promise<void>,
    host: HTMLDivElement
  ) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  seen.preview = false
  seen.cookie = undefined
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (
    overrides: Partial<LmSnackbarProps['content']> = {}
  ) => {
    await act(async () =>
      root.render(<Snackbar content={{ ...content, ...overrides }} />)
    )
  }
  try {
    await test(render, host)
  } finally {
    await act(async () => root.unmount())
    seen.preview = false
    seen.cookie = undefined
  }
}
it('preserves dialog styling, action order and outside dismissal policy', async () =>
  check(async (render, host) => {
    await render({
      dialog: true,
      max_width: 'sm',
      elevation: '4',
      square: true,
      prevent_click_outside: true
    })
    expect(seen.dialog).toMatchObject({
      open: true,
      maxWidth: 'sm',
      slotProps: { paper: { elevation: 4, square: true } }
    })
    expect(seen.dialog.onClose).toBeUndefined()
    expect(
      [...host.querySelectorAll('button')].map((b) => b.textContent)
    ).toEqual(['accept', 'message', 'extra'])
    expect(host.querySelector('button')?.getAttribute('data-color')).toBe(
      'secondary_text'
    )
    await render({ dialog: true })
    expect(seen.dialog.maxWidth).toBe(false)
    await act(async () => seen.dialog.onClose())
    expect(seen.dialog.open).toBe(false)
  }))
it('preserves toast styles, anchoring, action precedence and accept behavior', async () =>
  check(async (render, host) => {
    await render({
      width: '400px',
      anchor_horizontal: 'left',
      anchor_vertical: 'top',
      background_color: { rgba: 'red' },
      border_color: { rgba: 'blue' },
      variant: 'outlined',
      square: true,
      button_top_align: true,
      elevation: '2'
    } as Partial<LmSnackbarProps['content']>)
    expect(seen.snack).toMatchObject({
      open: true,
      anchorOrigin: { horizontal: 'left', vertical: 'top' },
      style: { width: '400px' }
    })
    expect(seen.body).toMatchObject({
      elevation: 2,
      variant: 'outlined',
      style: {
        width: '400px',
        backgroundColor: 'red',
        border: '1px solid blue',
        borderRadius: 0,
        alignItems: 'flex-start'
      }
    })
    expect(
      [...host.querySelectorAll('button')].map((b) => b.textContent)
    ).toEqual(['message', 'extra', 'accept'])
    expect(host.querySelectorAll('button')[1].getAttribute('data-color')).toBe(
      'primary'
    )
    await act(async () => host.querySelectorAll('button')[1].click())
    expect(seen.snack.open).toBe(true)
    await act(async () => host.querySelectorAll('button')[2].click())
    expect(seen.snack.open).toBe(false)
    await render()
    expect(seen.snack.anchorOrigin).toEqual({
      horizontal: 'center',
      vertical: 'bottom'
    })
    expect(seen.body.variant).toBe('elevation')
  }))
it('preserves editor preview despite an existing dismissal cookie', async () =>
  check(async (render, host) => {
    seen.cookie = 'true'
    seen.preview = true
    await render({ cookie_name: 'notice', dialog: true, auto_show: '100000' })
    expect(host.querySelector('[data-dialog]')).not.toBeNull()
  }))
