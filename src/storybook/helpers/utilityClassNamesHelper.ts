import { getCreatedStyles } from '../../utils/hooks/useGlobalStyles'
import { createMuiTheme } from '@material-ui/core/styles'

const generateUtilityClassNames = (): string[] => {

  const globalStyles = getCreatedStyles(createMuiTheme())

  const blacklist: string[] = ['.fonts-loaded', '.embed-responsive', '.embed-responsive-item', '.material-icons']
  const classNames: string[] = []
  Object.keys(globalStyles['@global']).forEach((key: string) => {
    if (key.startsWith('.')) {
      !blacklist.includes(key) && classNames.push(key.slice(1))
    } else if (key.startsWith('@media')) {
      Object.keys(globalStyles['@global'][key]).forEach((subKey: string) => {
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


