export const isDebugTiming = () => !!process.env.LUMEN_DEBUG_TIMING

export const logTiming = (label: string, start: number) => {
  console.log(
    `[lumen-timing] ${label} ${Math.round(performance.now() - start)}ms`
  )
}

export const timed = async <T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> => {
  if (!isDebugTiming()) return fn()
  const start = performance.now()
  try {
    return await fn()
  } finally {
    logTiming(label, start)
  }
}
