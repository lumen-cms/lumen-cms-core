import { DateTimeFormatStoryblok } from '../typings/generated/components-schema'

const getDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split('-')
  const [hour, minute] = time.split(':')
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  )
}

const exceptionDates = {
  de_easy: 'de'
}

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
  locale = exceptionDates[locale] || locale // support special locales
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
  let startDateTime = getDateTime(startDate, startTime)
  if (!endDate || allDay) {
    return dateTimeFormat.format(startDateTime)
  }
  let endDateTime = getDateTime(endDate, endTime)
  return startDateTime < endDateTime
    ? // @ts-ignore
      dateTimeFormat.formatRange(startDateTime, endDateTime)
    : // @ts-ignore
      dateTimeFormat.formatRange(endDateTime, startDateTime)
}
