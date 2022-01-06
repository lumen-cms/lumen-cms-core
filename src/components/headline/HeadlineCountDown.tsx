import { LmHeadlineCore } from './HeadlineCore'
import { LmHeadlineProps } from './headlineTypes'
import { useMemo } from 'react'
import { getDateTime } from '../../utils/intlDateHelper'
import Countdown from 'react-countdown'
import { LmComponentRender } from '@LmComponentRender'

export default function HeadlineCountDown({
  content,
  onClick
}: LmHeadlineProps) {
  const date = useMemo(() => {
    if (!content.countdown_time) {
      return new Date()
    }
    const [startDate, startTime] = content.countdown_time.split(' ')
    return getDateTime(startDate, startTime, true)
  }, [content.countdown_time])

  return (
    <LmHeadlineCore content={content} onClick={onClick}>
      <Countdown
        date={date}
        now={() => new Date().getTime()}
        intervalDelay={
          content.countdown_interval ? Number(content.countdown_interval) : 1000
        }
      >
        <>
          {content.countdown_finished?.map((blok) => (
            <LmComponentRender key={blok._uid} content={blok} />
          ))}
        </>
      </Countdown>
    </LmHeadlineCore>
  )
}
