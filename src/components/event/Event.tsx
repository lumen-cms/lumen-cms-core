import { LmEventProps } from './eventTypes'
import { LmComponentRender } from '@LmComponentRender'
import {
  HeadlineStoryblok,
  ImageStoryblok,
  RichTextEditorStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { getDateLocalized } from '../../utils/intlDateHelper'
import { useAppContext } from '@context/AppContext'

export default function LmEvent({ content }: LmEventProps) {
  const { locale } = useAppContext()
  const rteContent = content.content
  const body: (HeadlineStoryblok | RichTextEditorStoryblok | ImageStoryblok)[] =
    [
      {
        component: 'image',
        _uid: 'image',
        source: content.image?.filename,
        alt: content.image?.alt
      },
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
                  allDay: date.all_day,
                  options: content.date_format?.[0]
                })
              )
              .join('\n')
          : getDateLocalized({
              start: content.start,
              end: content.end,
              allDay: content.all_day,
              locale,
              options: content.date_format?.[0]
            })
      }
    ]
  if (rteContent) {
    body.push({
      component: 'rich_text_editor',
      _uid: 'rich_text_' + content._uid,
      body: rteContent
    } as RichTextEditorStoryblok)
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
