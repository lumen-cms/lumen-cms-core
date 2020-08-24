import React, { FunctionComponent, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import deviceDetect from '../../utils/deviceDetect'
import {
  defaultWindowsProvider,
  WindowDimensionsCtx,
  WithWindowDimensionsProps,
} from './context/WindowDimensionContext'

const WindowDimensionsProvider: FunctionComponent = ({ children }) => {
  const [dimensions, setDimensions] = useState<WithWindowDimensionsProps>(
    defaultWindowsProvider
  )
  const [debouncedCallback] = useDebouncedCallback(
    // function
    () => {
      setDimensions(getWindowDimensions())
    },
    // delay in ms
    500
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    setDimensions({
      ...getWindowDimensions(),
      ...deviceDetect(),
    })
    window.addEventListener('resize', debouncedCallback)
    return () => {
      window.removeEventListener('resize', debouncedCallback)
    }
  }, [])

  function getWindowDimensions() {
    const opts = {
      ...dimensions,
      height: window.innerHeight,
      width: window.innerWidth,
      isTabletWidth: window.innerWidth >= 600 && window.innerWidth < 960,
    }
    return opts
  }

  return (
    <WindowDimensionsCtx.Provider value={dimensions}>
      {children}
    </WindowDimensionsCtx.Provider>
  )
}

WindowDimensionsProvider.displayName = 'WindowDimensionsProvider'

export default WindowDimensionsProvider
