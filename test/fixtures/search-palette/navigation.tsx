// Framework boundary for the isolated component fixture. Actual result anchors
// perform browser navigation; this is not a Next.js application/router test.
import { forwardRef, type AnchorHTMLAttributes } from 'react'
const listeners = new Map<string, Set<() => void>>()
export const Router = {
  events: {
    on(name: string, callback: () => void) {
      if (!listeners.has(name)) listeners.set(name, new Set())
      listeners.get(name)!.add(callback)
    },
    off(name: string, callback: () => void) {
      listeners.get(name)?.delete(callback)
    }
  }
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  passHref?: boolean
  shallow?: boolean
  locale?: string | false
}
export default forwardRef<HTMLAnchorElement, Props>(function FixtureLink(
  {
    prefetch: _prefetch,
    replace: _replace,
    scroll: _scroll,
    passHref: _passHref,
    shallow: _shallow,
    locale: _locale,
    ...props
  },
  ref
) {
  return <a {...props} ref={ref} />
})
