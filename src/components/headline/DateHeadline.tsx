import { HeadlineStoryblok } from '../../typings/generated/components-schema'
import { LmHeadline } from './Headline'
import { LmDateHeadlineProps } from './headlineTypes'
import { useSyncExternalStore } from 'react'

// The clock is sampled on render, as before; do not add a timer/subscription.
const subscribeToYear = () => () => {}
const getCurrentYear = () => new Date().getFullYear()

export function LmDateHeadline({
  content
}: LmDateHeadlineProps): React.JSX.Element {
  const year = useSyncExternalStore(
    subscribeToYear,
    getCurrentYear,
    getCurrentYear
  )
  const modifContent = {
    ...content,
    text: content.text?.replace('{date}', `${year}`),
    text_xs: content.text_xs?.replace('{date}', `${year}`)
  }
  return <LmHeadline content={modifContent as unknown as HeadlineStoryblok} />
}
