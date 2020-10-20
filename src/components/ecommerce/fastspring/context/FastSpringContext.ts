import { createContext, useContext } from 'react'

export type FastSpringContextProps = {
  products: any[]
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
