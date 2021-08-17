import React from 'react'
import { Meta, Story } from '@storybook/react'
import { AppContextProps } from '@context/AppContext'
import { getComponentArgTypes } from '../../storybook/configControls'
import LmGoogleFormContainer from './LmGoogleFormContainer'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import { LmGoogleFormProps } from './googleFormProps'
import { fetchGoogleFormDataClient } from '../../utils/initial-props/component-data/fetchGoogleFormData'
import parseHijackedFormData from '../../utils/hooks/googleForms/parseHijackedFormData'
import AppProvider from '../provider/AppProvider'

const COMPONENT_NAME = 'form'

const presetContent =
  findFirstPreset<LmGoogleFormProps['content']>(COMPONENT_NAME)

// eslint-disable-next-line import/no-anonymous-default-export
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
    <AppProvider
      content={
        {
          formData: {
            [presetContent._uid]: formStructure
          }
        } as AppContextProps
      }
    >
      <LmGoogleFormContainer content={args} />
    </AppProvider>
  )
}

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}
