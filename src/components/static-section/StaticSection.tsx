import { LmComponentRender } from '../CoreComponents'
import { LmStaticSectionProps } from './staticTypes'
import clsx from 'clsx'

export function LmStaticSection({
  content
}: LmStaticSectionProps): React.JSX.Element | null {
  if (!content.container || typeof content.container === 'string') {
    return null
  }
  // is related resolve_relations: 'static_section.container'
  const body = content.container.content?.body ?? []
  return (
    <div className={clsx(content.class_names?.values)}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
