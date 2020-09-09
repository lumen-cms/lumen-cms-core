import React from 'react'
import { useGoogleForm } from '../src/utils/hooks/googleForms/useGoogleForm'

export default {
  title: 'GoogleForm Hook'
}

export const Example = () => {
  const { formStructure } = useGoogleForm('https://docs.google.com/forms/d/e/1FAIpQLSdw3tdslj4k94OU6bluk0Yobe997r8gV5obEbEdiMs70SKQPw/viewform?embedded=true')

  return (<>
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
  </>)
}
