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
        console.log(item)
        return (
          <div key={item._uid}>
            <h3>{item.storybook_name}</h3>
            <LmComponentRender content={item} />
          </div>
        )
      })}
    </>
  )
}
