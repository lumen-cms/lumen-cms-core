import { default as React } from 'react'
import { DateHeadlineStoryblok, HeadlineStoryblok } from '../../typings/generated/components-schema'
import { LmHeadline } from './Headline'

export type LmDateHeadlineProps = { content: DateHeadlineStoryblok }

export function LmDateHeadline({ content }: LmDateHeadlineProps): JSX.Element {
  const modifContent = {
    ...content,
    text: content.text?.replace('{date}', `${new Date().getFullYear()}`),
    text_xs: content.text_xs?.replace('{date}', `${new Date().getFullYear()}`)
  }
  return (
    <LmHeadline content={modifContent as unknown as HeadlineStoryblok} />
  )
}
