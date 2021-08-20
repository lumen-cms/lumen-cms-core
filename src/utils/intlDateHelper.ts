export const getDateLocalized = ({
  locale = 'en',
  start = '',
  end = '',
  allDay
}: {
  locale?: string
  start?: string
  end?: string
  allDay?: boolean
}) => {
  const [startDate, startTime] = start.split(' ')
  const [endDate, endTime] = (end || '').split(' ')
  const startStr = new Intl.DateTimeFormat(locale).format(new Date(startDate))
  const endStrIntl =
    endDate && endDate !== startDate
      ? new Intl.DateTimeFormat(locale).format(new Date(endDate))
      : ''
  if (allDay) {
    return startStr
  }
  const endStr = endTime
    ? endStrIntl
      ? ' - ' + endStrIntl + ' ' + endTime
      : ' - ' + endTime
    : ''
  return `${startStr} ${startTime}${endStr}`
}
