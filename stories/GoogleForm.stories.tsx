import React from 'react'
import { LmComponentRender, LmCoreComponents } from '../src/'
import { FormStoryblok } from '../src/typings/generated/components-schema'
import { LmGoogleForm } from '../src/components/google-form/GoogleForm'
import { storyButton, storyForm } from '../src/storybook/core/various'
import { GoogleFormExampleUrl } from '../src/utils/config'

LmCoreComponents.form = LmGoogleForm

const props: FormStoryblok = {
  _uid: '123098',
  component: 'form',
  api: GoogleFormExampleUrl,
  fields_full_width: true,
  submit_button: [storyButton()]
}

export default {
  title: 'GoogleForm Component'
}

export const Example = () => {
  return (
    <>
      <LmComponentRender content={{...props}}/>
    </>
  )
}

export const Playground = () => {
  return <>
    <LmComponentRender content={{...storyForm(), submit_button: [storyButton({options: {label: 'SubmitTest'}})]
    }}/>
  </>
}
