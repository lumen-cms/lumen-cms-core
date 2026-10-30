import { createContext, useContext } from 'react'
import { CategoryStateProp } from './pageContextTypes'

type PageContextProps = {
  value: CategoryStateProp
  updateContext: (args: CategoryStateProp) => void
}

export const PageContext = createContext<PageContextProps>({
  value: {},
  updateContext: () => {
    console.log('needs to be overwritten')
  }
})

export const usePageContext = (): PageContextProps => useContext(PageContext)
