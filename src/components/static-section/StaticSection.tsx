import { StaticSectionStoryblok } from '../../typings/generated/components-schema'
import React from 'react'
import clsx from 'clsx'
import { useAppContext } from '../provider/AppProvider'

export type LmStaticSectionProps = { content: StaticSectionStoryblok }

export function LmStaticSection({ content }: LmStaticSectionProps): JSX.Element | null {
  const { ComponentRender } = useAppContext()
  const { allStaticContent } = useAppContext()

  if (!content.container) {
    return null
  }

  const containerContent = allStaticContent.find((item) => item.uuid === content.container)
  const body: any[] = (containerContent && containerContent.content && containerContent.content.body) || []

  return (
    <div className={clsx(content.class_names && content.class_names.values)}>
      {body.map((blok, i) => ComponentRender({ content: blok, i }))}
    </div>
  )
}
