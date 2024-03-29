import * as React from 'react'
import { Meta, Story } from '@storybook/react'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'
import { storyStyles } from '../../storybook/core/various'
import { LmHeadline } from './Headline'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import { getComponentArgTypes } from '../../storybook/configControls'
import { LmDateHeadlineProps, LmHeadlineProps } from './headlineTypes'
import { LmDateHeadline } from './DateHeadline'

const COMPONENT_NAME = 'headline'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Data Display/Headline',
  component: LmHeadline,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
} as Meta

const Template: Story<LmHeadlineProps['content']> = (args) => (
  <LmHeadline content={args} />
)

export const Preset = () => (
  <StorybookPresetsContainer componentName={COMPONENT_NAME} />
)

const props: HeadlineStoryblok = {
  _uid: '12312',
  component: 'headline',
  text: 'A Basic Headline'
}

export const Basic = Template.bind({})
Basic.args = {
  ...props
}

const props1: HeadlineStoryblok = {
  ...props,
  text: 'Headline2',
  typography: 'headline2'
}

const props2: HeadlineStoryblok = {
  ...props,
  text: 'Headline3',
  typography: 'headline3'
}

const props3: HeadlineStoryblok = {
  ...props,
  text: 'Headline4',
  typography: 'headline4'
}

const props4: HeadlineStoryblok = {
  ...props,
  text: 'Headline5',
  typography: 'headline5'
}

const props5: HeadlineStoryblok = {
  ...props,
  text: 'Headline6',
  typography: 'headline6'
}

const props6: HeadlineStoryblok = {
  ...props,
  text: 'subtitle',
  typography: 'subtitle1'
}

const props7: HeadlineStoryblok = {
  ...props,
  text: 'subtitle2',
  typography: 'subtitle2'
}

export const Examples = () => (
  <>
    <LmHeadline content={props} />
    <LmHeadline content={props1} />
    <LmHeadline content={props2} />
    <LmHeadline content={props3} />
    <LmHeadline content={props4} />
    <LmHeadline content={props5} />
    <LmHeadline content={props6} />
    <LmHeadline content={props7} />
    <LmHeadline content={{ ...props7, typography: 'button', text: 'button' }} />
    <LmHeadline content={{ ...props7, typography: 'body1', text: 'body1' }} />
    <LmHeadline content={{ ...props7, typography: 'body2', text: 'body2' }} />
    <LmHeadline
      content={{ ...props7, typography: 'caption', text: 'caption' }}
    />
    <LmHeadline
      content={{ ...props7, typography: 'overline', text: 'overline' }}
    />
  </>
)
export const AlternativeFont = () => (
  <>
    <LmHeadline content={{ ...props3 }} />
    <LmHeadline content={{ ...props3, text: 'Font 1', font: 'alt1' }} />
    <LmHeadline content={{ ...props3, text: 'Font 2', font: 'alt2' }} />
    <LmHeadline content={{ ...props3, text: 'Font 3', font: 'alt3' }} />
    <LmHeadline content={{ ...props3, text: 'Font 4', font: 'alt4' }} />
  </>
)
export const AlternativeConfig = () => (
  <>
    <h3>Colors:</h3>
    <LmHeadline content={{ ...props3 }} />
    <LmHeadline content={{ ...props3, text: 'Primary', color: 'primary' }} />
    <LmHeadline
      content={{ ...props3, text: 'Secondary', color: 'secondary' }}
    />
    <LmHeadline
      content={{ ...props3, text: 'Text Primary', color: 'textPrimary' }}
    />
    <LmHeadline
      content={{ ...props3, text: 'Text Secondary', color: 'textSecondary' }}
    />
    <LmHeadline
      content={{ ...props3, text: 'Text Muted', color: 'textSecondary' }}
    />
    <LmHeadline content={{ ...props3, text: 'Text Error', color: 'error' }} />
    <LmHeadline
      content={{ ...props3, text: 'Custom', custom_color: { rgba: '#028800' } }}
    />
    <h3>Class names:</h3>
    <LmHeadline
      content={{
        ...props3,
        text: 'Font weight bold',
        class_names: { values: ['font-weight-bold'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Font weight bolder',
        class_names: { values: ['font-weight-bolder'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Font weight light',
        class_names: { values: ['font-weight-light'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Font weight lighter',
        class_names: { values: ['font-weight-lighter'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Font weight normal',
        class_names: { values: ['font-weight-normal'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Monospace',
        class_names: { values: ['text-monospace'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Uppercase',
        class_names: { values: ['text-uppercase'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Italic',
        class_names: { values: ['font-italic'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Muted',
        class_names: { values: ['text-muted'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color black 50%, Background primary',
        class_names: { values: ['text-black-50', 'bg-primary'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color black 50%, Background error/danger',
        class_names: { values: ['text-black-50', 'bg-danger'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color white 50%, Background secondary',
        class_names: { values: ['text-white-50', 'bg-secondary'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color white 50%, Background dark',
        class_names: { values: ['text-white-50', 'bg-dark'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color black 50%, Background light',
        class_names: { values: ['text-black-50', 'bg-light'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color black 50%, Background white',
        class_names: { values: ['text-black-50', 'bg-white'] }
      }}
    />
    <LmHeadline
      content={{
        ...props3,
        text: 'Color white 50%, Background black',
        class_names: { values: ['text-white-50', 'bg-black'] }
      }}
    />
    <hr />
    <h2>Example increase line height 2em:</h2>
    <LmHeadline
      content={{
        ...props3,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam enim nulla, ultricies eget posuere vel, accumsan quis eros. Nulla mattis risus sed sapien feugiat malesuada. Suspendisse porta nisi non risus efficitur, ac blandit orci cursus. Integer congue nulla massa, ac commodo lorem sollicitudin et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis eget feugiat lacus. Ut vehicula in lectus sed hendrerit.',
        tag: 'p',
        line_height: '2em'
      }}
    />
  </>
)

export const HeadlineCounter = Template.bind({})
HeadlineCounter.parameters = {
  chromatic: { delay: 3000 }
}
HeadlineCounter.args = {
  ...props,
  count_end: 10000,
  prefix: '+ ',
  suffix: ' Users'
}

const HeadlineDateTemplate: Story<LmDateHeadlineProps['content']> = (args) => (
  <LmDateHeadline content={args} />
)

export const HeadlineWithDate = HeadlineDateTemplate.bind({})
HeadlineWithDate.args = {
  component: 'date_headline',
  _uid: '123',
  text: '© {date} Copyright by Lumen Media'
}

export const WithStyles = () => (
  <div className="p-5 text-center">
    <LmHeadline
      content={
        {
          ...props,
          styles: [storyStyles({ knob: 'Styles', count: 1 })],
          styles_hover: [storyStyles({ knob: 'Styles Hover', count: 2 })]
        } as HeadlineStoryblok
      }
    />
  </div>
)
