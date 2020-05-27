import { LmComponentRender as LmParagraph } from '../src/'
import { ParagraphStoryblok } from '../src/typings/generated/components-schema'
import * as React from 'react'
import { storyParagraph } from '../src/storybook/core/various'

const props: ParagraphStoryblok = {
  _uid: '123',
  component: 'paragraph',
  text: 'Hello World'
}
const rte = {
  'type': 'doc',
  'content': [{
    'type': 'heading',
    'attrs': { 'level': 4 },
    'content': [{ 'text': 'hallo', 'type': 'text' }]
  }, {
    'type': 'paragraph',
    'content': [{ 'text': 'was istIcon ', 'type': 'text' }, {
      'text': 'denn ',
      'type': 'text',
      'marks': [{ 'type': 'italic' }]
    }, { 'text': 'hier', 'type': 'text', 'marks': [{ 'type': 'italic' }, { 'type': 'strike' }] }, {
      'text': ' so ',
      'type': 'text',
      'marks': [{ 'type': 'italic' }]
    }, { 'text': 'passiert', 'type': 'text', 'marks': [{ 'type': 'bold' }, { 'type': 'italic' }] }]
  }, {
    'type': 'paragraph',
    'content': [{ 'text': 'was ', 'type': 'text' }, {
      'text': 'denn ',
      'type': 'text',
      'marks': [{
        'type': 'link',
        'attrs': {
          'href': '/interning-to-bali-have-you-got-these-documents-prepared',
          'uuid': '2b53d62f-7420-4eb6-aff1-1a79b01fd6f3',
          'target': null,
          'linktype': 'story'
        }
      }]
    }, {
      'text': 'noch',
      'type': 'text',
      'marks': [{
        'type': 'link',
        'attrs': {
          'href': '/interning-to-bali-have-you-got-these-documents-prepared',
          'uuid': '2b53d62f-7420-4eb6-aff1-1a79b01fd6f3',
          'target': null,
          'linktype': 'story'
        }
      }, { 'type': 'bold' }]
    }, { 'text': '?', 'type': 'text' }]
  }, {
    'type': 'bullet_list',
    'content': [{
      'type': 'list_item',
      'content': [{
        'type': 'paragraph',
        'content': [{ 'text': 'Icon', 'type': 'text' }, {
          'text': 'hallo',
          'type': 'text',
          'marks': [{ 'type': 'underline' }]
        }]
      }]
    }, {
      'type': 'list_item',
      'content': [{
        'type': 'paragraph',
        'content': [{
          'text': 'das',
          'type': 'text',
          'marks': [{ 'type': 'styled', 'attrs': { 'class': 'text-primary' } }]
        }, { 'text': ' ist', 'type': 'text' }]
      }]
    }, {
      'type': 'list_item',
      'content': [{
        'type': 'paragraph',
        'content': [{ 'text': 'ja ', 'type': 'text' }, {
          'text': 'eine',
          'type': 'text',
          'marks': [{
            'type': 'link',
            'attrs': {
              'href': '/internship-at-the-childrens-home-in-jimbaran',
              'uuid': '8c9ffed9-f69b-46e6-a2ce-a2ce7aeaac24',
              'target': '_blank',
              'linktype': 'story'
            }
          }]
        }, { 'text': ' List', 'type': 'text' }]
      }]
    }]
  }, { 'type': 'horizontal_rule' }, {
    'type': 'ordered_list',
    'attrs': { 'order': 1 },
    'content': [{
      'type': 'list_item',
      'content': [{ 'type': 'paragraph', 'content': [{ 'text': 'first', 'type': 'text' }] }]
    }, {
      'type': 'list_item',
      'content': [{ 'type': 'paragraph', 'content': [{ 'text': 'second', 'type': 'text' }] }]
    }, { 'type': 'list_item', 'content': [{ 'type': 'paragraph', 'content': [{ 'text': 'third', 'type': 'text' }] }] }]
  }, {
    'type': 'heading',
    'attrs': { 'level': 1 },
    'content': [{ 'text': 'Headings:', 'type': 'text' }]
  }, {
    'type': 'heading',
    'attrs': { 'level': 2 },
    'content': [{ 'text': 'hallo', 'type': 'text' }]
  }, {
    'type': 'heading',
    'attrs': { 'level': 3 },
    'content': [{ 'text': 'hallo', 'type': 'text' }]
  }, { 'type': 'paragraph' }, {
    'type': 'paragraph',
    'content': [{ 'text': 'some ', 'type': 'text' }, {
      'text': 'more',
      'type': 'text',
      'marks': [{ 'type': 'styled', 'attrs': { 'class': 'text-warning' } }]
    }, { 'text': ' ', 'type': 'text' }]
  }, {
    'type': 'paragraph',
    'content': [{
      'text': 'Dises ist toll',
      'type': 'text',
      'marks': [{ 'type': 'styled', 'attrs': { 'class': 'badge badge-pill badge-primary' } }]
    }]
  }]
}

export default {
  title: 'Paragraph'
}

export const MarkdownParagraph = () => (
  <>
    <LmParagraph content={props} />
    <LmParagraph content={{ ...props, typography: 'subtitle2' }} />
    <LmParagraph content={{ ...props, typography: 'headline5' }} />
    <LmParagraph content={{ ...props, typography: 'headline5' }} />
    <LmParagraph content={{ ...props, typography: 'body2' }} />
  </>
)
export const RichTextParagraph = () => (
  <>
    <LmParagraph content={{ _uid: '12', component: 'rich_text_editor', body: rte }} />
  </>
)
export const Playground = () => (
  <div className="p-5">
    <LmParagraph content={{ ...storyParagraph() }} />
  </div>
)

