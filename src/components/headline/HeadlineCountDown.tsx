import { LmHeadlineCore } from './HeadlineCore'
import { LmHeadlineProps } from './headlineTypes'
import { useState } from 'react'
import { getDateTime } from '../../utils/intlDateHelper'
import Countdown from 'react-countdown'
import { LmComponentRender } from '../CoreComponents'

export default function HeadlineCountDown({
  content,
  onClick
}: LmHeadlineProps) {
  const countdownTime = content.countdown_time
  const createDeadline = () => {
    if (!countdownTime) return { source: countdownTime, date: new Date() }
    const [startDate, startTime] = countdownTime.split(' ')
    return {
      source: countdownTime,
      date: getDateTime(startDate, startTime, true)
    }
  }
  const [deadline, setDeadline] = useState(createDeadline)
  if (deadline.source !== countdownTime) {
    setDeadline(createDeadline)
  }

  return (
    <LmHeadlineCore content={content} onClick={onClick}>
      <Countdown
        date={deadline.date}
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
