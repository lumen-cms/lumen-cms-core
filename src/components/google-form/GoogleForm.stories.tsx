import { LmComponentRender } from '@LmComponentRender'
import { GoogleFormExampleUrl } from '@CONFIG'
import React from 'react'
import { FormStoryblok } from '../../typings/generated/components-schema'
import {
  storyButton,
  storyForm,
  storyParagraph
} from '../../storybook/core/various'
import { useGoogleForm } from '../../utils/hooks/googleForms/useGoogleForm'

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

export const Hook = () => {
  const { formStructure } = useGoogleForm(
    'https://docs.google.com/forms/d/e/1FAIpQLSdw3tdslj4k94OU6bluk0Yobe997r8gV5obEbEdiMs70SKQPw/viewform?embedded=true'
  )

  return (
    <>
      <h3>{formStructure?.title}</h3>
      <h2>{formStructure?.description}</h2>
      <p>FormAction: {formStructure?.formAction}</p>
      <>
        {formStructure?.fields.map((f) => (
          <div key={f.answerSubmitIdValue}>
            <p>{f.questionTypeName.name}</p>
            <small>{JSON.stringify(f)}</small>
          </div>
        ))}
      </>
    </>
  )
}
