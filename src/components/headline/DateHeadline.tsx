import React from 'react'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'
import { LmHeadline } from './Headline'
import { LmDateHeadlineProps } from './headlineTypes'

export function LmDateHeadline({ content }: LmDateHeadlineProps): JSX.Element {
  const modifContent = {
    ...content,
    text: content.text?.replace('{date}', `${new Date().getFullYear()}`),
    text_xs: content.text_xs?.replace('{date}', `${new Date().getFullYear()}`)
  }
  return <LmHeadline content={(modifContent as unknown) as HeadlineStoryblok} />
}
