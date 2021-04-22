import React from 'react'
import { Meta, Story } from '@storybook/react'
import { getComponentArgTypes } from '../../storybook/configControls'
import LmGoogleFormContainer from './LmGoogleFormContainer'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import { LmGoogleFormProps } from './googleFormProps'
import { fetchGoogleFormDataClient } from '../../utils/initial-props/fetchGoogleFormData'
import parseHijackedFormData from '../../utils/hooks/googleForms/parseHijackedFormData'
import { LmAppProvider } from '../../index'

const COMPONENT_NAME = 'form'

const presetContent = findFirstPreset<LmGoogleFormProps['content']>(
  COMPONENT_NAME
)

export default {
  title: 'Design/Inputs/GoogleForm',
  component: LmGoogleFormContainer,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  },
  loaders: [
    async () => {
      const res = await fetchGoogleFormDataClient(presetContent.api as string)
      const parsedData = parseHijackedFormData(res)
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
    <LmAppProvider
      // @ts-ignore
      content={{
        formData: {
          [presetContent._uid]: formStructure
        }
      }}
    >
      <LmGoogleFormContainer content={args} />
    </LmAppProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}
