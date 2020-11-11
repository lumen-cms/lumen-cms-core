import { createContext, useContext } from 'react'
import { FastSpringProduct } from '../fastSpringTypes'

export type FastSpringContextProps = {
  products: FastSpringProduct[]
  setRedirect: (path: string) => void
}

export const FastSpringContext = createContext<FastSpringContextProps>({
  products: [],
  setRedirect: () => {
    return null
  }
})
export const useFastspringContext = () =>
  useContext<FastSpringContextProps>(FastSpringContext)
