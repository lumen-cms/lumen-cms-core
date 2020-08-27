import React from 'react'
import clsx from 'clsx'
import { useAppContext } from '../provider/context/AppContext'
import { LmComponentRender } from '../CoreComponents'
import { LmStaticSectionProps } from './staticTypes'

export function LmStaticSection({
  content
}: LmStaticSectionProps): JSX.Element | null {
  const { allStaticContent } = useAppContext()

  if (!content.container) {
    return null
  }

  const containerContent = allStaticContent.find(
    (item) => item.uuid === content.container
  )
  const body: any[] =
    (containerContent &&
      containerContent.content &&
      containerContent.content.body) ||
    []

  return (
    <div className={clsx(content.class_names && content.class_names.values)}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </div>
  )
}
