import React from 'react'
import { LmComponentRender, LmCoreComponents } from '../src/'
import { FormStoryblok } from '../src/typings/generated/components-schema'
import { LmGoogleForm } from '../src/components/google-form/GoogleForm'

LmCoreComponents.form = LmGoogleForm

const props: FormStoryblok = {
  _uid: '123098',
  component: 'form',
  api: 'https://docs.google.com/forms/d/e/1FAIpQLSdw3tdslj4k94OU6bluk0Yobe997r8gV5obEbEdiMs70SKQPw/viewform?embedded=true',
  fields_full_width: true
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
