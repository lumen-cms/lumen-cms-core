// @ts-ignore
import { components } from '../../components.82895.json'
// @ts-ignore
import { presets } from '../../presets.82895.json'

export function findPresets<T = undefined>(componentName: string): T[] {
  const found = components.find((item) => item.name === componentName)
  const componentId = found?.id
  if (componentId) {
    // @ts-ignore
    return presets
      .filter((i) => i.component_id === componentId)
      .map((i) => ({
        ...i.preset,
        storybook_name: i.name
      }))
  }
  return []
}

export function findFirstPreset<T = undefined>(componentName: string): T {
  const find = findPresets<T>(componentName)
  // @ts-ignore
  return find?.[0]
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
