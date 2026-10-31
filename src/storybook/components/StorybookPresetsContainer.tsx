import { findPresets } from '../findStorybookPresets'
import { LmComponentRender } from '../../components/CoreComponents'

export default function StorybookPresetsContainer({
  componentName,
  presetItems
}: {
  componentName?: string
  presetItems?: any[]
}): React.JSX.Element {
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
      {items.map((item: any) => {
        return (
          <div key={JSON.stringify([item._uid, item.storybook_name])}>
            <h3>{item.storybook_name}</h3>
            <LmComponentRender content={item} />
          </div>
        )
      })}
    </>
  )
}
