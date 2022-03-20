import { createGlobalStyles } from '../../utils/hooks/useGlobalStyles'
import { createTheme } from '@mui/material/styles'

const generateUtilityClassNames = (): string[] => {
  // the getCreatedStyles is removed... @TODO if Storybook still need to be supported
  const globalStyles = createGlobalStyles(createTheme())
  // const globalStyles = {
  //   '@global': {
  //     'pa-1': ''
  //   }
  // }
  // const globalStyles = getCreatedStyles(createTheme())

  const blacklist: string[] = [
    '.fonts-loaded',
    '.embed-responsive',
    '.embed-responsive-item',
    '.material-icons'
  ]
  const classNames: string[] = []
  Object.keys(globalStyles).forEach((key: string) => {
    if (key.startsWith('.')) {
      !blacklist.includes(key) && classNames.push(key.slice(1))
    } else if (key.startsWith('@media')) {
      Object.keys(globalStyles[key] as any).forEach((subKey: string) => {
        if (subKey.startsWith('.')) {
          !blacklist.includes(subKey) && classNames.push(subKey.slice(1))
        }
      })
    }
  })
  return classNames
}
export const utilityClassNames = generateUtilityClassNames()

// console.log('utilityClassNames', JSON.stringify(utilityClassNames)) // => use this to generate JSON for utilityClassNames.json

export const getOptions = () => {
  const obj = {}
  utilityClassNames.forEach((key) => {
    obj[key] = key
  })
  return obj
}

export const classNameOpts = getOptions()
