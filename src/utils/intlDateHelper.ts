import { DateTimeFormatStoryblok } from '../typings/generated/components-schema'

const getDateTime = (date: string, time: string) =>
  new Date(
    // @ts-ignore
    ...[
      ...date.split('-').map((i) => Number(i)),
      ...time.split(':').map((i) => Number(i))
    ]
  )
export const getDateLocalized = ({
  locale = 'en',
  start = '',
  end = '',
  allDay,
  options
}: {
  locale?: string
  start?: string
  end?: string
  allDay?: boolean
  options?: DateTimeFormatStoryblok
}) => {
  const [startDate, startTime] = start.split(' ')
  const [endDate, endTime] = (end || '').split(' ')
  if (!startDate) {
    return ''
  }
  let startOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
  }
  if (options?.hide_time || allDay) {
    delete startOptions.hour
    delete startOptions.minute
  }
  if (options) {
    if (options.dateStyle || options.timeStyle) {
      startOptions = {
        dateStyle: options.dateStyle || undefined,
        timeStyle: options.timeStyle || undefined
      }
    } else {
      delete options.hide_time
      Object.keys(options).forEach((key) => {
        let optionValue = options[key]
        if (optionValue) {
          startOptions[key] = optionValue
        }
      })
    }
  }
  const dateTimeFormat = new Intl.DateTimeFormat(locale, startOptions)
  if (!endDate || allDay) {
    return dateTimeFormat.format(getDateTime(startDate, startTime))
  }
  // @ts-ignore
  return dateTimeFormat.formatRange(
    getDateTime(startDate, startTime),
    getDateTime(endDate, endTime)
  )
}
