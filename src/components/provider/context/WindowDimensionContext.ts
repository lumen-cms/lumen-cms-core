import { createContext, useContext } from 'react'

export type WithWindowDimensionsProps = {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export const defaultWindowsProvider: WithWindowDimensionsProps = {
  height: 500,
  width: 599, // mobile
  isMobile: true,
  isTablet: false,
  isDesktop: false
}

export const WindowDimensionsCtx = createContext(defaultWindowsProvider)
export const useWindowDimensions = () => useContext(WindowDimensionsCtx)
