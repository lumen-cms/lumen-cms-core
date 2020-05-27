import * as React from 'react'
import ResizeListener from './ResizeListener'
//@ts-ignore
const defaultReporter = (target?: HTMLElement) => ({
  width: target != null ? target.offsetWidth : null,
  height: target != null ? target.offsetHeight : null
})

export default function useResizeAware(
  reporter: typeof defaultReporter = defaultReporter
) {

  const [sizes, setSizes] = React.useState(
    // @ts-ignore
    reporter(null)
  )
  const onResize = React.useCallback(ref => setSizes(reporter(ref.current)), [
    reporter
  ])
  // @ts-ignore
  const resizeListenerNode = React.useMemo(() => <ResizeListener onResize={onResize} />, [onResize])

  return [resizeListenerNode, sizes]
}
