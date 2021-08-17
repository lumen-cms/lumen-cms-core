import { LmEventProps } from './eventTypes'
import { LmComponentRender } from '@LmComponentRender'
import {
  HeadlineStoryblok,
  RichTextEditorStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'

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
      component: 'rich_text_editor',
      _uid: 'richtext',
      body: content.description
    }
  ]
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
            body: body
          }
        ]
      }
    ]
  }
  return <LmComponentRender content={items} />
}
