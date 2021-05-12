import { Meta, Story } from '@storybook/react'
import {
  FlexRowStoryblok,
  HeadlineStoryblok,
  IconStoryblok
} from '../../typings/generated/components-schema'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import { LmFlexRow } from './FlexRow'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import { LmFlexRowProps } from './flexRowTypes'
import { getComponentArgTypes } from '../../storybook/configControls'

const COMPONENT_NAME = 'flex_row'
export default {
  title: 'Design/Layout/Flex Row',
  component: LmFlexRow,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
} as Meta

const Template: Story<LmFlexRowProps['content']> = (args) => (
  <LmFlexRow content={args} />
)

const presetContent = findFirstPreset<LmFlexRowProps['content']>(COMPONENT_NAME)

export const Preset = () => (
  <StorybookPresetsContainer componentName="flex_row" />
)

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

const icon: IconStoryblok = {
  _uid: '232123',
  component: 'icon',
  name: {
    name: 'home'
  },
  size: 'large'
}

const headline: HeadlineStoryblok = {
  _uid: '12312',
  component: 'headline',
  text: 'Headline1',
  typography: 'headline4'
}

const props: FlexRowStoryblok = {
  _uid: '2we',
  component: 'flex_row',
  body: [icon, headline]
}

const props2: FlexRowStoryblok = {
  _uid: '223434',
  component: 'flex_row',
  body: [{ ...headline, _uid: '123123' }, headline]
}

const props3: FlexRowStoryblok = {
  _uid: '223434',
  component: 'flex_row',
  body: [icon, { ...headline, _uid: '123123' }, headline]
}
const flexRowProps = {
  _uid: '2we',
  component: 'flex_row',
  gap: 2,
  align_items: 'center',
  body: [{ ...icon, size: 'small' }, headline]
} as FlexRowStoryblok
export const FlexGap = () => {
  return (
    <>
      <div>
        <h3>Gap 1:</h3>
        <LmFlexRow
          content={{
            ...flexRowProps,
            gap: 1
          }}
        />
      </div>
      <div>
        <h3>Gap 2:</h3>
        <LmFlexRow content={flexRowProps} />
      </div>
      <div>
        <h3>Gap 3:</h3>
        <LmFlexRow
          content={{
            ...flexRowProps,
            gap: 3
          }}
        />
      </div>
    </>
  )
}

export const Examples = () => (
  <>
    <div style={{ width: '500px', height: '300px', backgroundColor: '#ccc' }}>
      <LmFlexRow content={props} />
      <LmFlexRow content={{ ...props2, justify: 'center' }} />
      <LmFlexRow content={{ ...props3, justify: 'space-between' }} />
      <LmFlexRow content={{ ...props3, justify: 'space-around' }} />
      <LmFlexRow content={{ ...props3, align_items: 'flex-start' }} />
    </div>
    <h3>Column variant</h3>
    <div style={{ width: '500px', height: '200px', backgroundColor: '#ccc' }}>
      <LmFlexRow
        content={{
          ...props,
          column: true,
          justify: 'space-between',
          full_height: true
        }}
      />
    </div>
    <h3>Column variant centered</h3>
    <div style={{ width: '500px', height: '200px', backgroundColor: '#ccc' }}>
      <LmFlexRow
        content={{
          ...props,
          column: true,
          align_items: 'center',
          justify: 'space-between',
          full_height: true
        }}
      />
    </div>
  </>
)
