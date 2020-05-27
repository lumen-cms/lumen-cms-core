import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export function useInfiniteScroll(collection: any[], perPage = 30) {
  const [page, setPage] = useState<number>(1)
  const [useRef, inView] = useInView({ triggerOnce: true })
  const offset = (page - 1) * perPage

  useEffect(
    () => {
      if (inView) {
        setPage(page + 1)
      }
    },
    [inView]
  )

  return {
    ref: useRef,
    data: collection.slice(0, offset + perPage),
    hasMore: Math.ceil(collection.length / perPage) > page
  }
}
