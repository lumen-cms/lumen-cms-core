import { LmNewsProps } from './newsTypes'
import {
  HeadlineStoryblok,
  ImageStoryblok,
  RichTextEditorStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import { getDateLocalized } from '../../utils/intlDateHelper'
import { useRouter } from 'next/router'

export default function LmNews({ content }: LmNewsProps) {
  const { locale } = useRouter()
  const body: (HeadlineStoryblok | RichTextEditorStoryblok | ImageStoryblok)[] =
    [
      {
        component: 'image',
        _uid: 'image',
        source: content.image?.filename
      },
      {
        component: 'headline',
        _uid: 'headline',
        tag: 'h1',
        typography: 'headline2',
        text: content.title
      },
      {
        component: 'headline',
        _uid: 'subtitle1',
        tag: 'h5',
        typography: 'subtitle1',
        text: [
          getDateLocalized({ start: content.published, locale }),
          content.category?.content?.name
        ]
          .filter((i) => i)
          .join(' - ')
      },
      {
        component: 'headline',
        _uid: 'body1',
        tag: 'p',
        typography: 'body1',
        support_linebreak: true,
        text: content.description
      }
    ]
  if (content.content) {
    body.push({
      component: 'rich_text_editor',
      _uid: 'richtext',
      body: content.content
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
