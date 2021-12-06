import React from 'react'
import { Meta, Story } from '@storybook/react'
import { getComponentArgTypes } from '../storybook/configControls'
import LmGoogleFormContainer from '../components/google-form/LmGoogleFormContainer'
import { findPresets } from '../storybook/findStorybookPresets'
import { LmGoogleFormProps } from '../components/google-form/googleFormProps'
import { googleFormGetData } from '../utils/initial-props/component-data/googleFormData'

const COMPONENT_NAME = 'form'

const presets = findPresets<LmGoogleFormProps['content']>(COMPONENT_NAME)
const presetContent = presets[0]
const secondPreset = presets[1]
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Inputs/GoogleForm',
  component: LmGoogleFormContainer,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  },
  loaders: [
    // @ts-ignore
    async ({ args }: any) => {
      // const res = await fetchGoogleFormDataClient(args.api as string)
      // const parsedData = parseHijackedFormData(res)
      const parsedData = await googleFormGetData(args)
      return {
        formStructure: parsedData
      }
    }
  ]
} as Meta

const Template: Story<LmGoogleFormProps['content']> = (
  args,
  { loaded: { formStructure } }
) => {
  return (
    <LmGoogleFormContainer
      content={{
        ...args,
        form_data: formStructure
      }}
    />
  )
}

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

export const Inline = Template.bind({})
Inline.args = {
  ...secondPreset
}
