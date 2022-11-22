import { FastSpringProduct } from '../fastSpringTypes'
import create from 'zustand'

export type FastSpringContextProps = {
  products: FastSpringProduct[]
  currency: string
  redirect: string
  setRedirect: (path: string) => void
  setProducts: (products: any[]) => void
  setCurrency: (currency: string) => void
}
export const useFastspringContext = create<FastSpringContextProps>()((set) => ({
  products: [],
  currency: 'USD',
  redirect: '',
  setCurrency: (currency) => set({ currency }),
  setProducts: (products) => set({ products: products }),
  setRedirect: (path) => set({ redirect: path })
}))

// export const FastSpringContext = createContext<FastSpringContextProps>({
//   products: [],
//   currency: 'USD',
//   setRedirect: () => {
//     return null
//   }
// })
// export const useFastspringContext = () =>
//   useContext<FastSpringContextProps>(FastSpringContext)
