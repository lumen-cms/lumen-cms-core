import React from 'react'
import { LmComponentRender, LmCoreComponents } from '../src/'
import { FormStoryblok } from '../src/typings/generated/components-schema'
import { LmGoogleForm } from '../src/components/google-form/GoogleForm'
import { storyButton, storyForm, storyParagraph } from '../src/storybook/core/various'
import { GoogleFormExampleUrl } from '../src/utils/config'

LmCoreComponents.form = LmGoogleForm

const props: FormStoryblok = {
  _uid: '123098',
  component: 'form',
  // api: GoogleFormExampleUrl,
  api: 'https://docs.google.com/forms/d/e/1FAIpQLSdflinC8Ua4vLjNca_WGckSKYc_9ww0OTUgdfM9DJ0NRIFKqQ/viewform?embedded=true',
  fields_full_width: true,
  submit_button: [storyButton()],
  success_body: [ storyParagraph() ]
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
