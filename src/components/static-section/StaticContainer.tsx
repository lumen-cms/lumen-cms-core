import { LmComponentRender } from '@LmComponentRender'
import { LmStaticContainerProps } from './staticTypes'

export function LmStaticContainer({
  content
}: LmStaticContainerProps): React.JSX.Element {
  return (
    <div className="lm-static-container">
      {(content.body || []).map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
