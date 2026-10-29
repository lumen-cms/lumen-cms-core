import React, {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Router } from 'next/router'
import type { ListSearchAutocompleteStoryblok } from '../../typings/generated/components-schema'

const SearchPaletteDialog = lazy(() => import('./SearchPaletteDialog'))
type Opener = { content: ListSearchAutocompleteStoryblok }
type PaletteContext = {
  register: (opener: Opener) => () => void
  open: (content: ListSearchAutocompleteStoryblok) => void
}
const Context = createContext<PaletteContext | null>(null)
export const useSearchPalette = () => useContext(Context)

export function SearchPaletteProvider({ children }: React.PropsWithChildren) {
  const parent = useSearchPalette()
  return parent ? (
    <>{children}</>
  ) : (
    <SearchPaletteRoot>{children}</SearchPaletteRoot>
  )
}

function SearchPaletteRoot({ children }: React.PropsWithChildren) {
  const openers = useRef(new Set<Opener>())
  const [count, setCount] = useState(0)
  const [active, setActive] = useState<ListSearchAutocompleteStoryblok | null>(
    null
  )
  const register = useCallback((opener: Opener) => {
    openers.current.add(opener)
    setCount(openers.current.size)
    return () => {
      openers.current.delete(opener)
      if (!openers.current.size) setActive(null)
      setCount(openers.current.size)
    }
  }, [])
  const close = useCallback(() => setActive(null), [])
  const value = useMemo(() => ({ register, open: setActive }), [register])
  useEffect(() => {
    if (!count) return
    const keydown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        !event.isComposing &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault()
        if (!event.repeat)
          setActive(
            (current) =>
              current || openers.current.values().next().value?.content || null
          )
      }
    }
    document.addEventListener('keydown', keydown)
    Router.events.on('routeChangeStart', close)
    return () => {
      document.removeEventListener('keydown', keydown)
      Router.events.off('routeChangeStart', close)
    }
  }, [count, close])
  return (
    <Context.Provider value={value}>
      {children}
      {!!count && active && (
        <Suspense fallback={null}>
          <SearchPaletteDialog content={active} onClose={close} />
        </Suspense>
      )}
    </Context.Provider>
  )
}
