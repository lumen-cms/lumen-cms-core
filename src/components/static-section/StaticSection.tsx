import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmStaticSectionProps } from './staticTypes'
import clsx from 'clsx'

export function LmStaticSection({
  content
}: LmStaticSectionProps): JSX.Element | null {
  if (!content.container) {
    return null
  }
  // is related resolve_relations: 'static_section.container'
  const body: any[] = content.container.content?.body ?? []
  return (
    <div className={clsx(content.class_names?.values)}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
