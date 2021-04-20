import { findPresets } from '../findStorybookPresets'
import { LmComponentRender } from '@LmComponentRender'

export default function StorybookPresetsContainer({
  componentName
}: {
  componentName: string
}): JSX.Element {
  const items = findPresets(componentName)
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
          <div key={item.id}>
            <h3>{item.name}</h3>
            <LmComponentRender content={item.preset} />
          </div>
        )
      })}
    </>
  )
}
