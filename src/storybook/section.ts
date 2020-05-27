import {
  BackgroundStoryblok,
  ButtonStoryblok,
  ColumnStoryblok,
  HeadlineStoryblok,
  ParagraphStoryblok,
  RowStoryblok,
  SectionStoryblok
} from '../typings/generated/components-schema'
import { storyColumn, storyRow, storySection } from './core/section'
import { storyButton, storyHeadline, storyParagraph } from './core/various'

const backgroundItem = {
  _uid: '2131',
  component: 'background',
  image: 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
} as BackgroundStoryblok

const items: (HeadlineStoryblok | ParagraphStoryblok | ButtonStoryblok)[] = [{
  component: 'headline',
  _uid: 'ododod',
  text: 'Headline'
}, {
  text: '<h3>Hello World</h3>',
  component: 'paragraph',
  _uid: '789'
}, {
  text: '<h4>Some Paragraph</h4>',
  _uid: '987',
  component: 'paragraph'
}, {
  component: 'button',
  _uid: 'wfjwefj',
  label: 'Test'
}, {
  component: 'button',
  _uid: 'ghfdsrewe',
  icon: {
    name: 'home'
  }
}, {
  component: 'button',
  _uid: 'sdefe3343qwdassdf',
  icon: {
    name: 'home'
  },
  variant: 'outlined'
}, {
  component: 'button',
  _uid: '123131fdsf',
  icon: {
    name: 'home'
  },
  color: 'primary'
}, {
  component: 'button',
  _uid: 'sdwer234ddsfg',
  icon: {
    name: 'home'
  },
  variant: 'outlined',
  color: 'primary'
}, {
  component: 'button',
  _uid: '12313dssad',
  label: 'Test',
  variant: 'outlined'
}, {
  component: 'button',
  _uid: 'asdfef',
  label: 'Test',
  variant: 'outlined',
  color: 'primary'
}]

const column: ColumnStoryblok[] = [{
  body: items,
  _uid: '321',
  component: 'column'
}]

export const columns: ColumnStoryblok[] = [{
  body: items,
  _uid: '23424324432',
  component: 'column',
  width_general: 'true'
}, {
  body: items,
  _uid: '252435131',
  component: 'column',
  width_general: 'true'
}, {
  body: items,
  _uid: '341531545',
  component: 'column',
  width_general: 'true'
}]


export const columnsWithImage: ColumnStoryblok[] = [{
  body: items,
  _uid: '23424324432',
  component: 'column',
  width_general: '4',
  background: [backgroundItem]
}, {
  body: items,
  _uid: '252435131',
  component: 'column',
  width_general: '4',
  background: [{
    _uid: 'fsdfs',
    component: 'background',
    shadow_effect: 'bouncy'
  }] as BackgroundStoryblok[]
}, {
  body: items,
  _uid: '341531545',
  component: 'column',
  width_general: '4',
  background: [backgroundItem]
}]

export const row: RowStoryblok[] = [{
  body: column,
  _uid: 'qdfaefa',
  component: 'row'
}]

export const rowWithColumns: RowStoryblok[] = [{
  body: columns,
  _uid: 'qw1223',
  component: 'row'
}]

export const darkSectionWithColumns: SectionStoryblok = {
  body: rowWithColumns,
  variant: 'dark',
  _uid: '234212dfe',
  component: 'section'
}


export const rowWithImage: RowStoryblok[] = [{
  body: column,
  _uid: 'qdfaefa',
  component: 'row',
  background: [{ ...backgroundItem }]
}]

export const get3ColumnsSection = ({ count, knob }: { count?: number, knob?: string } = {}) => ({
  ...storySection({ knob, count }),
  body: [{
    ...storyRow({ knob }),
    body: [{
      ...storyColumn({ options: { width_general: '4' }, knob }),
      body: [
        storyHeadline({ count: 1, knob }),
        storyHeadline({ count: 2, knob }),
        storyParagraph({ count: 1, knob }),
        storyButton({ count: 1, knob }),
        storyButton({ count: 2, knob })
      ]
    }, {
      ...storyColumn({ options: { width_general: '4' }, knob }),
      body: [
        storyHeadline({ count: 3, knob }),
        storyHeadline({ count: 4, knob }),
        storyParagraph({ knob, count: 2 }),
        storyButton({ count: 3, knob }),
        storyButton({ count: 3, knob, options: { variant: 'outlined', color: 'primary' } })
      ]
    }, {
      ...storyColumn({ options: { width_general: '4' } }),
      body: [
        storyHeadline({ count: 5, knob }),
        storyHeadline({ count: 6, knob }),
        storyParagraph({ knob, count: 3 }),
        storyButton({ knob })
      ]
    }]
  }]
})
