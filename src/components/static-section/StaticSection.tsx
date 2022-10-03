import React from 'react'
import { useStyles } from 'tss-react/mui'
import { LmComponentRender } from '@LmComponentRender'
import { LmStaticSectionProps } from './staticTypes'

export function LmStaticSection({
  content
}: LmStaticSectionProps): JSX.Element | null {
  const { cx } = useStyles()
  if (!content.container) {
    return null
  }
  // is related resolve_relations: 'static_section.container'
  const body: any[] = content.container.content?.body ?? []
  return (
    <div className={cx(content.class_names?.values)}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
