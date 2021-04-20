import { LmComponentRender } from '@LmComponentRender'
import { GoogleFormExampleUrl } from '@CONFIG'
import React from 'react'
import { FormStoryblok } from '../../typings/generated/components-schema'
import {
  storyButton,
  storyForm,
  storyParagraph
} from '../../storybook/core/various'

const getProps = () => {
  const props: FormStoryblok = {
    _uid: '123098',
    component: 'form',
    api: GoogleFormExampleUrl,
    fields_full_width: true,
    submit_button: [storyButton()],
    success_body: [storyParagraph()]
  }
  return props
}

export default {
  title: 'Design/Inputs/GoogleForm'
}

export const Component = () => {
  return (
    <>
      <LmComponentRender content={{ ...getProps() }} />
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
