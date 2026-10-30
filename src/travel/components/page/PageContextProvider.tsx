import { PropsWithChildren, useState } from 'react'
import { CategoryStateProp } from './pageContextTypes'
import { PageContext } from './PageContext'

export function PageContextProvider({ children }: PropsWithChildren<{}>) {
  const [value, setValue] = useState<CategoryStateProp>({})
  // const router = useRouter()
  // const categoryQueryParams = router.query
  // const initialValues = {}
  // Object.keys(categoryQueryParams).forEach(key => {
  //   if (categoryTypes.includes(key)) {
  //     initialValues[key] = categoryQueryParams[key]
  //   }
  // })

  // const updateHistory = (options: CategoryStateProp) => {
  //   const currentUrl = new URL(window.location.href)
  //   categoryTypes.forEach(key => {
  //     currentUrl.searchParams.delete(key)
  //     // @ts-ignore
  //     options[key] && currentUrl.searchParams.append(key, options[key])
  //   })
  //   window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href)
  // }

  const updateContext = (passedValue: CategoryStateProp) => {
    const newOptions = {
      ...value
    }
    Object.keys(passedValue).forEach((key) => {
      // @ts-ignore
      if (passedValue[key]) {
        // @ts-ignore
        newOptions[key] = passedValue[key]
      } else {
        // @ts-ignore
        delete newOptions[key]
      }
    })

    // console.log("inside of updatecontext", passedValue)
    setValue(newOptions)
    // updateHistory(newOptions)
    window.scrollTo(0, 0)
  }

  return (
    <PageContext.Provider value={{ value, updateContext }}>
      {children}
    </PageContext.Provider>
  )
}
