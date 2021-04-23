import { findPresets } from '../findStorybookPresets'
import { LmComponentRender } from '@LmComponentRender'

export default function StorybookPresetsContainer({
  componentName,
  presetItems
}: {
  componentName?: string
  presetItems?: any[]
}): JSX.Element {
  const items = presetItems || (componentName ? findPresets(componentName) : [])
  if (!items.length) {
    return (
      <div>
        <h3>Currently there are no presets </h3>
      </div>
    )
  }
  return (
    <>
      {items.map((item: any, i) => {
        return (
          <div key={item._uid + '_' + i}>
            <h3>{item.storybook_name}</h3>
            <LmComponentRender content={item} />
          </div>
        )
      })}
    </>
  )
}
