import { Meta, Story } from '@storybook/react'
import { LmListWidgetProps } from './listWidgetTypes'
import { findPresets } from '../../storybook/findStorybookPresets'
import LmListWidget from './ListWidget'
import { getComponentArgTypes } from '../../storybook/configControls'
import { CONFIG } from '@CONFIG'
import { listWidgetGetData } from '../../utils/initial-props/component-data/listWidgetData'

const COMPONENT_NAME = 'list_widget'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Content/List Widget',
  component: LmListWidget,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  },
  loaders: [
    // @ts-ignore
    async ({ args }) => {
      CONFIG.publicToken = 'm85LRUo0sX4yo9Q96VMQlQtt'
      CONFIG.previewToken = 'qASJXPT2cwH76pA9vpJbxAtt'
      CONFIG.rootDirectory = 'en'
      return {
        list_widget_data: await listWidgetGetData(args, {
          locale: 'en',
          defaultLocale: 'en'
        })
      }
    }
  ]
} as Meta

const presets = findPresets<LmListWidgetProps['content']>(COMPONENT_NAME)

const Template: Story<LmListWidgetProps['content']> = (
  args,
  { loaded: { list_widget_data } }
) => {
  return <LmListWidget content={{ ...args, list_widget_data }} />
}
//
export const Basic = Template.bind({})
Basic.args = {
  ...presets[0]
}

export const Variant_1 = Template.bind({})
Variant_1.args = {
  ...presets[1]
}

export const Variant_2 = Template.bind({})
Variant_2.args = {
  ...presets[2]
}
