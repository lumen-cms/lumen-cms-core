import React from 'react'
import clsx from 'clsx'
import { StaticSectionStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { LmComponentRender } from '../CoreComponents'

export type LmStaticSectionProps = { content: StaticSectionStoryblok }

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
      {body.map((blok, i) => LmComponentRender({ content: blok, i }))}
    </div>
  )
}
