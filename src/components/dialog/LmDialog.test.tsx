import type { DialogProps } from '@mui/material/Dialog'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import LmDialog from './LmDialog'

type ReceivedProps = DialogProps & { TransitionComponent?: unknown }
const received = vi.hoisted(() => vi.fn<(props: ReceivedProps) => void>())

vi.mock('@mui/material/Dialog', () => ({
  default: (props: ReceivedProps) => {
    received(props)
    return <div>{props.children}</div>
  }
}))

it('preserves dialog options and slide selection without mutating caller props', () => {
  const onClose = vi.fn()
  const dialogProps = Object.freeze({ open: true, fullScreen: true, onClose })
  const content = {
    component: 'dialog' as const,
    _uid: 'dialog',
    title: 'Title'
  }
  const setOpen = vi.fn()

  for (const slide_up of [false, true, false]) {
    const html = renderToStaticMarkup(
      <LmDialog
        dialogProps={dialogProps}
        content={{ ...content, slide_up }}
        setOpen={setOpen}
      />
    )
    const props = received.mock.lastCall?.[0]
    expect(props).toMatchObject({ open: true, fullScreen: true, onClose })
    expect(Boolean(props?.TransitionComponent)).toBe(slide_up)
    expect(html).toContain('Title')
    expect(dialogProps).not.toHaveProperty('TransitionComponent')
  }
})
