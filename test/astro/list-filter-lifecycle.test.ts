// @vitest-environment happy-dom
import { expect, it, vi } from 'vitest'
import { initializeListFilters } from '../../packages/lumen-cms-astro/src/client/listFilter'
import { addSearchParamsToUrl } from '../../packages/lumen-cms-shared/src/core/utils/state/actions'
vi.mock('../../packages/lumen-cms-shared/src/core/utils/state/actions', () => ({ addSearchParamsToUrl: vi.fn() }))
it('cancels pending URL updates and input handlers when a list search is removed', () => {
 vi.useFakeTimers()
 document.body.innerHTML = '<div data-list-search><input/><button>Clear</button></div>'
 const root = document.body.firstElementChild!
 const input = root.querySelector('input')!
 try {
  initializeListFilters()
  input.value = 'Old page query'
  input.dispatchEvent(new Event('input'))
  root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
  root.remove()
  vi.advanceTimersByTime(600)
  expect(addSearchParamsToUrl).not.toHaveBeenCalled()
  input.dispatchEvent(new Event('input'))
  vi.advanceTimersByTime(600)
  expect(addSearchParamsToUrl).not.toHaveBeenCalled()
 } finally { vi.useRealTimers(); document.body.replaceChildren() }
})
