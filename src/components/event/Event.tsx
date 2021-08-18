import { LmEventProps } from './eventTypes'
import { LmComponentRender } from '@LmComponentRender'
import {
  HeadlineStoryblok,
  RichTextEditorStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'

const getEventDate = (start: string, end: string, allDay?: boolean) => {
  const [startDate, startTime] = start.split(' ')
  const [endDate, endTime] = end.split(' ')
  const startStr = new Intl.DateTimeFormat('de').format(new Date(startDate))
  const endStrIntl =
    endDate !== startDate
      ? new Intl.DateTimeFormat('de').format(new Date(endDate))
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

export default function LmEvent({ content }: LmEventProps) {
  const body: (HeadlineStoryblok | RichTextEditorStoryblok)[] = [
    {
      component: 'headline',
      _uid: 'headline',
      tag: 'h1',
      typography: 'headline2',
      align: 'center',
      text: content.title
    },
    {
      component: 'headline',
      _uid: 'headline',
      tag: 'h5',
      typography: 'subtitle1',
      align: 'center',
      support_linebreak: true,
      text: content.multiple_event_dates?.length
        ? content.multiple_event_dates
            .map((date) =>
              getEventDate(date.start || '', date.end || '', date.all_day)
            )
            .join('\n')
        : getEventDate(content.start, content.end || '', content.all_day)
    }
  ]
  if (content.description) {
    body.push({
      component: 'rich_text_editor',
      _uid: 'richtext',
      body: content.description
    })
  }
  const items: SectionStoryblok = {
    _uid: content._uid,
    component: 'section',
    body: [
      {
        component: 'row',
        _uid: 'row',
        body: [
          {
            component: 'column',
            _uid: 'column',
            body: [...body, ...(content.body || [])]
          }
        ]
      }
    ]
  }
  return (
    <>
      <LmComponentRender content={items} />
    </>
  )
}
