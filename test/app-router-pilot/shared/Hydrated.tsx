'use client'
import { useEffect } from 'react'

// Identical measurement marker in both fixtures; not shipped by the library.
export function Hydrated() {
  useEffect(() => {
    performance.mark('lumen-pilot-hydrated')
  }, [])
  return null
}
