// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { SWRConfig } from 'swr'
import LmListSearchAutocomplete from './ListSearchAutocomplete'
import { SearchPaletteProvider } from './SearchPaletteProvider'
import SearchPaletteDialog from './SearchPaletteDialog'
import { fetchSearchStories, SearchStory } from './searchPaletteData'
import { AppContext } from '../provider/context/AppContext'

let currentSlug = '/initial'
let currentLocale = 'en'
let currentElement: React.ReactNode
vi.mock('./searchPaletteData', async (original) => ({
  ...(await original<typeof import('./searchPaletteData')>()),
  fetchSearchStories: vi.fn()
}))
vi.mock('../link/MuiNextLink', () => ({
  default: ({ children, prefetch: _prefetch, sx: _sx, ...props }: any) => (
    <a {...props}>{children}</a>
  )
}))
vi.mock('../icon/LmIcon', () => ({ default: () => <span>Icon</span> }))

let host: HTMLDivElement
let root: Root
const content = {
  _uid: 'search',
  component: 'list_search_autocomplete' as const,
  label: 'Find content'
}
const result = (uuid: string, title: string, component = 'page'): SearchStory =>
  ({
    uuid,
    name: title,
    full_slug: title.toLowerCase(),
    content: { component, title }
  }) as SearchStory
const key = async (target: Element | Document, value: string, extra = {}) => {
  await act(async () => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: value,
        bubbles: true,
        cancelable: true,
        ...extra
      })
    )
  })
}
const click = async (target: Element) => {
  await act(async () => {
    ;(target as HTMLElement).click()
  })
}
const type = async (text: string) => {
  const input = document.querySelector('input')!
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )!.set!.call(input, text)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
const tick = async (ms = 450) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}
const render = async (element: React.ReactNode) => {
  currentElement = element
  await act(async () => {
    root.render(
      <AppContext.Provider
        value={{
          slug: currentSlug,
          locale: currentLocale,
          defaultLocale: 'en',
          locales: ['en']
        }}
      >
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
          {element}
        </SWRConfig>
      </AppContext.Provider>
    )
  })
}
beforeEach(() => {
  currentSlug = '/initial'
  currentLocale = 'en'
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  vi.mocked(fetchSearchStories).mockReset().mockResolvedValue([])
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.useRealTimers()
})
it('shares one dialog, honors clicked configuration, restores focus, resets and cleans up in StrictMode', async () => {
  await render(
    <StrictMode>
      <SearchPaletteProvider>
        <LmListSearchAutocomplete content={content} />
        <LmListSearchAutocomplete
          content={{ ...content, _uid: 'second', label: 'Second search' }}
        />
      </SearchPaletteProvider>
    </StrictMode>
  )
  const buttons = host.querySelectorAll('button')
  await click(buttons[1])
  await tick(250)
  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
  expect(
    document.getElementById(
      document
        .querySelector('[role="dialog"]')!
        .getAttribute('aria-labelledby')!
    )?.textContent
  ).toBe('Second search')
  expect(document.activeElement?.tagName).toBe('INPUT')
  await type('query')
  await key(document.querySelector('input')!, 'Escape')
  expect(document.querySelector('[role="dialog"]')).toBeNull()
  expect(document.activeElement).toBe(buttons[1])
  await tick()
  expect(fetchSearchStories).not.toHaveBeenCalled()
  await key(document, 'k', { metaKey: true })
  await tick(250)
  expect(
    document.getElementById(
      document
        .querySelector('[role="dialog"]')!
        .getAttribute('aria-labelledby')!
    )?.textContent
  ).toBe('Find content')
  expect(document.querySelector('input')?.value).toBe('')
  await key(document, 'k', { ctrlKey: true })
  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
  currentSlug = '/another-page'
  await render(currentElement)
  expect(document.querySelector('[role="dialog"]')).toBeNull()
  await render(<></>)
  await key(document, 'k', { ctrlKey: true })
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})
it('debounces, keeps body matches, clears short queries and selects with Enter', async () => {
  const close = vi.fn()
  vi.mocked(fetchSearchStories).mockResolvedValue([
    result('one', 'Unrelated title', 'page')
  ])
  await render(<SearchPaletteDialog content={content} onClose={close} />)
  await type('bo')
  await tick(399)
  expect(fetchSearchStories).not.toHaveBeenCalled()
  await tick(1)
  expect(fetchSearchStories).toHaveBeenCalledTimes(1)
  expect(document.querySelector('[role="option"]')?.textContent).toContain(
    'Unrelated title'
  )
  await type('b')
  expect(document.querySelector('[role="option"]')).toBeNull()
  await type('body')
  await tick()
  await key(document.querySelector('input')!, 'ArrowDown')
  await key(document.querySelector('input')!, 'Enter')
  expect(close).toHaveBeenCalled()
})
it('ignores stale responses and exposes retry on failure', async () => {
  let resolveOld: (stories: SearchStory[]) => void = () => {}
  vi.mocked(fetchSearchStories)
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve
        })
    )
    .mockResolvedValueOnce([result('new', 'New result')])
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue([])
  await render(<SearchPaletteDialog content={content} onClose={vi.fn()} />)
  await type('old')
  await tick()
  await type('new')
  await tick()
  await act(async () => resolveOld([result('old', 'Old result')]))
  expect(document.querySelector('[role="option"]')?.textContent).toContain(
    'New result'
  )
  await type('error')
  await tick()
  expect(document.body.textContent).toContain('Search could not be loaded')
  await click(
    Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Retry'
    )!
  )
  expect(document.body.textContent).toContain('No results found')
})
it('works standalone and opens from Ctrl+K', async () => {
  await render(<LmListSearchAutocomplete content={content} />)
  await key(document, 'k', { ctrlKey: true })
  await tick(250)
  expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  await click(document.querySelector('[aria-label="Close search"]')!)
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})

it('opens directly from the mobile icon and respects dialog paper settings', async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
  await render(
    <LmListSearchAutocomplete
      content={{
        ...content,
        mobile_breakpoint: 'md',
        menu_outlined: true,
        menu_square: true
      }}
    />
  )
  const opener = host.querySelector('button')!
  expect(opener.className).toContain('MuiIconButton')
  expect(host.querySelector('input')).toBeNull()
  await click(opener)
  await tick(250)
  const dialog = document.querySelector('[role="dialog"]')!
  expect(dialog.className).toContain('MuiDialog-paperFullScreen')
  expect(dialog.className).toContain('MuiPaper-outlined')
  expect(dialog.className).not.toContain('MuiPaper-rounded')
  expect(document.activeElement?.tagName).toBe('INPUT')
})

it('closes after pointer selection and follows the resolved result link', async () => {
  vi.mocked(fetchSearchStories).mockResolvedValue([
    result('page', 'Page', 'page'),
    result('landing', 'Landing page', 'page')
  ])
  await render(<LmListSearchAutocomplete content={content} />)
  await click(host.querySelector('button')!)
  await tick(250)
  await type('search')
  await tick()
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
  const link = document.querySelector<HTMLAnchorElement>(
    '#search-result-landing'
  )!
  expect(link.getAttribute('href')).toBe('/landing page')
  await click(link)
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})

it('dismisses on backdrop interaction', async () => {
  await render(<LmListSearchAutocomplete content={content} />)
  await click(host.querySelector('button')!)
  await tick(250)
  const backdrop = document.querySelector('.MuiDialog-container')!
  await act(async () => {
    backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  expect(document.querySelector('[role="dialog"]')).toBeNull()
})

it('preserves the live status sequence, custom empty text and result counts', async () => {
  await render(
    <SearchPaletteDialog
      content={{ ...content, not_found_label: 'Nothing matched' }}
      onClose={vi.fn()}
    />
  )
  const status = () => document.querySelector('[role="status"]')!
  expect(status().textContent).toBe('Type at least 2 characters to search.')
  expect(status().getAttribute('aria-live')).toBe('polite')
  await type('ab')
  expect(status().textContent).toBe('Searching…')
  await tick()
  expect(status().textContent).toBe('Nothing matched')
  vi.mocked(fetchSearchStories).mockResolvedValue([
    result('one', 'One'),
    result('two', 'Two')
  ])
  await type('next')
  await tick()
  expect(status().textContent).toBe('2 results')
  await type('x')
  expect(status().textContent).toBe('Type at least 2 characters to search.')
})

it('localizes all palette states and accessible labels using the current locale', async () => {
  currentLocale = 'de-DE'
  vi.mocked(fetchSearchStories)
    .mockResolvedValueOnce([result('one', 'Erste Seite')])
    .mockResolvedValueOnce([
      result('one', 'Erste Seite'),
      result('two', 'Zweite Seite')
    ])
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue([])
  await render(
    <LmListSearchAutocomplete content={{ ...content, label: undefined }} />
  )
  expect(host.querySelector('button')?.getAttribute('aria-label')).toBe('Suche')
  await click(host.querySelector('button')!)
  await tick(250)
  expect(document.querySelector('h2')?.textContent).toBe('Suche')
  expect(
    document.querySelector('[aria-label="Suche schließen"]')
  ).not.toBeNull()
  expect(document.querySelector('input')?.placeholder).toBe(
    'Seiten und Landingpages durchsuchen'
  )
  expect(document.querySelector('input')?.getAttribute('aria-label')).toBe(
    'Suche'
  )
  const status = () => document.querySelector('[role="status"]')?.textContent
  expect(status()).toBe('Gib mindestens 2 Zeichen ein, um zu suchen.')
  await type('eins')
  expect(status()).toBe('Suche läuft…')
  await tick()
  expect(status()).toBe('1 Ergebnis')
  await type('zwei')
  await tick()
  expect(status()).toBe('2 Ergebnisse')
  await type('fehler')
  await tick()
  expect(status()).toContain('Die Suche konnte nicht geladen werden.')
  await click(
    Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'Erneut versuchen'
    )!
  )
  expect(status()).toBe('Keine Ergebnisse gefunden.')
  await click(document.querySelector('[aria-label="Suche schließen"]')!)
  await click(host.querySelector('button')!)
  await tick(250)
  expect(status()).toBe('Gib mindestens 2 Zeichen ein, um zu suchen.')
})

it('preserves CMS translations over locale defaults', async () => {
  currentLocale = 'de'
  await render(
    <SearchPaletteDialog
      content={{
        ...content,
        label: 'Tutorials finden',
        placeholder: 'Tutorial suchen',
        not_found_label: 'Keine Tutorials'
      }}
      onClose={vi.fn()}
    />
  )
  expect(document.querySelector('h2')?.textContent).toBe('Tutorials finden')
  expect(document.querySelector('input')?.placeholder).toBe('Tutorial suchen')
  await type('test')
  await tick()
  expect(document.querySelector('[role="status"]')?.textContent).toBe(
    'Keine Tutorials'
  )
})
