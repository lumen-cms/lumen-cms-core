// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeSearch } from '../../packages/lumen-cms-astro/src/client/search'

afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
 vi.useRealTimers()
})

it('uses the page locale for loading, results, errors, retry and reset', async () => {
 vi.useFakeTimers()
 vi.stubGlobal('fetch', vi.fn()
  .mockResolvedValueOnce({ ok: true, json: async () => ({ stories: [{ uuid: 'one', full_slug: 'de/page', name: 'Seite', content: {} }] }) })
  .mockRejectedValueOnce(new Error('offline'))
  .mockResolvedValue({ ok: true, json: async () => ({ stories: [] }) }))
 document.body.innerHTML = `<div data-lm-search data-search-locale="de-DE" data-search-config='{"publicToken":"test","languages":[]}'><button data-search-trigger>Suche</button><dialog id="test"><button data-search-close>Close</button><input /><div data-search-status></div><button hidden data-search-retry>Retry</button><ul></ul></dialog></div>`
 const dialog = document.querySelector('dialog')!
 const input = document.querySelector('input')!
 const status = document.querySelector('[data-search-status]')!
 vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {})
 initializeSearch()
 document.querySelector<HTMLButtonElement>('[data-search-trigger]')!.click()
 const type = (value: string) => { input.value = value; input.dispatchEvent(new Event('input')) }
 type('a')
 expect(status.textContent).toBe('Gib mindestens 2 Zeichen ein, um zu suchen.')
 type('ab')
 expect(status.textContent).toBe('Suche läuft…')
 await vi.advanceTimersByTimeAsync(400)
 expect(status.textContent).toBe('1 Ergebnis')
 type('error')
 await vi.advanceTimersByTimeAsync(400)
 expect(status.textContent).toContain('Die Suche konnte nicht geladen werden.')
 const retry = document.querySelector<HTMLButtonElement>('[data-search-retry]')!
 expect(retry.hidden).toBe(false)
 retry.click()
 await vi.advanceTimersByTimeAsync(0)
 expect(status.textContent).toBe('Keine Ergebnisse gefunden.')
 document.querySelector<HTMLElement>('[data-lm-search]')!.dataset.notFound = 'Keine Tutorials'
 type('other')
 await vi.advanceTimersByTimeAsync(400)
 expect(status.textContent).toBe('Keine Tutorials')
 dialog.close()
 await vi.advanceTimersByTimeAsync(0)
 expect(status.textContent).toBe('Gib mindestens 2 Zeichen ein, um zu suchen.')
})
