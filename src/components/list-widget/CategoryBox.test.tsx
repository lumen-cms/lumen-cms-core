// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import CategoryBox from './CategoryBox'
import type { LmCategoryBoxProps } from './listWidgetTypes'
const fixture = vi.hoisted(() => ({ selected: ['a', 'a'], set: vi.fn() }))
vi.mock('next/router', () => ({
  useRouter: () => ({ query: { search__categories: fixture.selected } })
}))
vi.mock('../../utils/state/searchState', () => ({
  setSearchCategorySelector: () => {},
  useSearchStore: () => fixture.set
}))
vi.mock('@mui/material/FormControlLabel', () => ({
  default: ({ control }: any) => control
}))
vi.mock('@mui/material/Checkbox', () => ({
  default: (props: any) => <input type="checkbox" {...props} />
}))
it('uses indexed membership and preserves selection/removal and array-valued tags', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const includes = vi.spyOn(fixture.selected, 'includes')
  const content = {
    _uid: 'cats',
    component: 'category_box',
    category_box_data: [
      { uuid: 'a', name: 'A', content: {} },
      { uuid: 'b', name: 'B', content: {} },
      {
        uuid: 'tagged',
        name: 'Tagged',
        content: { tag_reference: { values: ['a'] } }
      }
    ]
  } as unknown as LmCategoryBoxProps['content']
  const host = document.createElement('div')
  const root = createRoot(host)
  try {
    await act(async () => root.render(<CategoryBox content={content} />))
    expect(includes).not.toHaveBeenCalled()
    expect((host.querySelector('#a') as HTMLInputElement).checked).toBe(true)
    expect((host.querySelector('#b') as HTMLInputElement).checked).toBe(false)
    expect((host.querySelector('#tagged') as HTMLInputElement).checked).toBe(
      false
    )
    await act(async () =>
      (host.querySelector('#b') as HTMLInputElement).click()
    )
    expect(fixture.set).toHaveBeenLastCalledWith(['a', 'a', 'b'])
    await act(async () =>
      (host.querySelector('#a') as HTMLInputElement).click()
    )
    expect(fixture.set).toHaveBeenLastCalledWith(['b'])
  } finally {
    await act(async () => root.unmount())
  }
})
