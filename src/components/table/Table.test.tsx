// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Table from './Table'
import type { LmTableProps } from './tableTypes'

it('preserves row DOM and edited input values when CMS rows and headings reorder', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (thead: string[], tbody: string[][]) => {
    const content = {
      component: 'table',
      _uid: 'table',
      body: { thead, tbody }
    } as LmTableProps['content']
    await act(async () => root.render(<Table content={content} />))
  }
  try {
    const alpha = ['Alpha', '<input aria-label="Alpha" value="initial">']
    const beta = ['Beta', '<input aria-label="Beta" value="initial">']
    await render(['Name', 'Value'], [alpha, beta])
    const row = host.querySelector('tbody tr')!,
      heading = host.querySelector('th')!
    const input = host.querySelector('input')!
    input.value = 'user edit'
    await render(['Value', 'Name'], [[...beta], [...alpha]])
    expect(host.querySelectorAll('tbody tr')[1]).toBe(row)
    expect(host.querySelectorAll('th')[1]).toBe(heading)
    expect(host.querySelectorAll('input')[1]).toBe(input)
    expect(host.querySelectorAll('input')[1].value).toBe('user edit')
    await render(
      ['Same', 'Same'],
      [
        ['Repeat', 'Repeat'],
        ['Repeat', 'Repeat']
      ]
    )
    expect(host.querySelectorAll('th')).toHaveLength(2)
    expect(host.querySelectorAll('td')).toHaveLength(4)
  } finally {
    await act(async () => root.unmount())
  }
})
