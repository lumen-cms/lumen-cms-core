import { LmEventProps } from './eventTypes'
import { LmComponentRender } from '@LmComponentRender'
import {
  HeadlineStoryblok,
  RichTextEditorStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { useRouter } from 'next/router'
import { getDateLocalized } from '../../utils/intlDateHelper'

export default function LmEvent({ content }: LmEventProps) {
  const { locale } = useRouter()
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
      _uid: 'subtitle1',
      tag: 'h5',
      typography: 'subtitle1',
      align: 'center',
      support_linebreak: true,
      text: content.multiple_event_dates?.length
        ? content.multiple_event_dates
            .map((date) =>
              getDateLocalized({
                locale,
                start: date.start,
                end: date.end,
                allDay: date.all_day
              })
            )
            .join('\n')
        : getDateLocalized({
            start: content.start,
            end: content.end,
            allDay: content.all_day,
            locale
          })
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
