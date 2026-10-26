import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import GoogleForm from '../components/google-form/GoogleForm'
import type { GoogleForm as FormStructure } from '../vendor/google-forms'

const form: FormStructure = {
  title: 'Offline application fixture',
  action: 'e/offline-fixture',
  fvv: 1,
  pageHistory: 0,
  fbzx: 'fixture',
  fieldsOrder: {},
  fields: [
    { id: '101', type: 'SHORT_ANSWER', label: 'Name', required: true },
    { id: '102', type: 'LONG_ANSWER', label: 'Motivation', required: false },
    {
      id: '103',
      type: 'DROPDOWN',
      label: 'Program',
      required: true,
      options: [{ label: 'Design' }, { label: 'Teaching' }]
    },
    {
      id: '104',
      type: 'CHECKBOX',
      label: 'Interests',
      required: false,
      options: [{ label: 'Culture' }, { label: 'Environment' }]
    },
    { id: '105', type: 'DATE', label: 'Start date', required: true }
  ]
}

const meta: Meta<typeof GoogleForm> = {
  title: 'Design/Inputs/GoogleForm fixtures',
  component: GoogleForm,
  parameters: { chromatic: { viewports: [375, 1280] } },
  args: {
    formStructure: form,
    content: {
      _uid: 'offline-form',
      component: 'form',
      api: '',
      form_data: form,
      submit_button: [
        {
          _uid: 'submit',
          component: 'button',
          label: 'Validate test form',
          variant: 'raised'
        }
      ],
      fields_full_width: true,
      fields_border: 'outlined',
      fields_gap: '8',
      error_msg_required: 'This field is required'
    }
  }
}
export default meta
type Story = StoryObj<typeof meta>
// Empty api deliberately prevents submission to Google. These stories have no loader.
export const AllFields: Story = {}
export const RequiredValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Validate test form' })
    )
    await expect(
      await canvas.findAllByText('This field is required')
    ).toHaveLength(3)
    await userEvent.click(canvas.getByRole('combobox', { name: /Program/ }))
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(await page.findByRole('option', { name: 'Design' }))
    await expect(
      canvas.getByRole('combobox', { name: /Program/ })
    ).toHaveTextContent('Design')
  }
}
export const Inline: Story = {
  args: {
    content: { ...meta.args!.content!, inline: true, fields_full_width: false }
  }
}
