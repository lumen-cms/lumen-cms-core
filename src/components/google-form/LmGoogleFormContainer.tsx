import dynamic from 'next/dynamic'
import { LmGoogleFormProps } from './googleFormProps'

const GoogleFormEl = dynamic(
  () => import(/* webpackChunkName: 'googleForm' */ './GoogleForm')
)
export default function LmGoogleFormContainer({ content }: LmGoogleFormProps) {
  return <GoogleFormEl formStructure={content.form_data} content={content} />
}
