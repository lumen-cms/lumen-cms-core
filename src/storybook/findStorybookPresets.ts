import { components } from '../../components.82895.json'
// @ts-ignore
import { presets } from '../../presets.82895.json'

export const findPresets = (componentName: string) => {
  const found = components.find((item) => item.name === componentName)
  const componentId = found?.id
  if (componentId) {
    return presets.filter((i) => i.component_id === componentId)
  }
  return []
}

// simple function to show which component has presets available
// activate below and check the console log in browser inside of Storybook
// @ts-ignore
const displayAllComponentsWithPresets = () => {
  const found = components
    .filter((item: any) => item.all_presets?.length)
    .map((item) => item.name)
  console.log(found)
}
// displayAllComponentsWithPresets()
