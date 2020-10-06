import React from 'react'
import { LmComponentRender } from '../src/'
import { FormStoryblok } from '../src/typings/generated/components-schema'
import {
  storyButton,
  storyForm,
  storyParagraph
} from '../src/storybook/core/various'
import { GoogleFormExampleUrl } from '../src/utils/config'

const props: FormStoryblok = {
  _uid: '123098',
  component: 'form',
  api: GoogleFormExampleUrl,
  fields_full_width: true,
  submit_button: [storyButton()],
  success_body: [storyParagraph()]
}

export default {
  title: 'GoogleForm Component'
}

export const Example = () => {
  return (
    <>
      <LmComponentRender content={{ ...props }} />
    </>
  )
}

export const Playground = () => {
  return (
    <>
      <LmComponentRender
        content={{
          ...storyForm(),
          submit_button: [storyButton({ options: { label: 'SubmitTest' } })]
        }}
      />
    </>
  )
}
