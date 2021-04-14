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
