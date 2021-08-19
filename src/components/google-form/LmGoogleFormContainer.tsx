import dynamic from 'next/dynamic'
import { LmGoogleFormProps } from './googleFormProps'
import { useState } from 'react'

const GoogleFormEl = dynamic(
  () => import(/* webpackChunkName: 'googleForm' */ './GoogleForm')
)
export default function LmGoogleFormContainer({ content }: LmGoogleFormProps) {
  // const [inViewRef, elementInView] = useInView(intersectionDefaultOptions)
  const [formStructure] = useState(content.form_data)
  // return !elementInView ? (
  //   <LinearProgress variant="query" ref={inViewRef} />
  // ) : formStructure ? (
  //   <GoogleFormEl formStructure={formStructure} content={content} />
  // ) : null

  return <GoogleFormEl formStructure={formStructure} content={content} />
}
