import { useCallback, useState, useSyncExternalStore } from 'react'

function createMotionStartStore() {
  let started: boolean | undefined
  return {
    getSnapshot: () => started,
    subscribe: (notify: () => void, inView: boolean, delay: number) => {
      let timer: number | undefined
      const start = () => {
        if (started !== true) {
          started = true
          notify()
        }
      }
      // React subscribes after commit: the first transition frame stays hidden.
      if (inView) {
        if (delay) timer = window.setTimeout(start, delay)
        else start()
      }
      return () => window.clearTimeout(timer)
    }
  }
}

export function useMotionStart(inView: boolean, delay: number) {
  const [store] = useState(createMotionStartStore)
  const subscribe = useCallback(
    (notify: () => void) => store.subscribe(notify, inView, delay),
    [store, inView, delay]
  )
  return useSyncExternalStore(subscribe, store.getSnapshot, store.getSnapshot)
}
