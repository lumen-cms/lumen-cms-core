import { createContext, useContext } from 'react'

export type FastSpringContextProps = {
  products: any[]
}

export const FastSpringContext = createContext<FastSpringContextProps>({
  products: []
})
export const useFastspringContext = () =>
  useContext<FastSpringContextProps>(FastSpringContext)
