import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

export function useInfiniteScroll<T>(collection: T[], perPage = 30) {
  const [page, setPage] = useState<number>(1)
  const [useRef, inView] = useInView()
  const [previousInView, setPreviousInView] = useState(false)
  const offset = (page - 1) * perPage

  // Count visibility transitions without committing a stale page first.
  if (previousInView !== inView) {
    setPreviousInView(inView)
    if (inView) {
      setPage((previousPage) => previousPage + 1)
    }
  }

  return {
    ref: useRef,
    data: collection.slice(0, offset + perPage),
    hasMore: Math.ceil(collection.length / perPage) > page
  }
}
