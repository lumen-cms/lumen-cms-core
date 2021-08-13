import LinearProgress from '@material-ui/core/LinearProgress'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { LmGoogleFormProps } from './googleFormProps'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

const GoogleFormEl = dynamic(
  () => import(/* webpackChunkName: 'googleForm' */ './GoogleForm')
)
export default function LmGoogleFormContainer({ content }: LmGoogleFormProps) {
  // const { formData } = useAppContext()

  const [inViewRef, elementInView] = useInView(intersectionDefaultOptions)
  // const { formStructure } = useGoogleForm(
  //   elementInView ? content.api || '' : ''
  // )
  // const formStructure = formData?.[content._uid]
  const formStructure = content.form_data
  return !elementInView ? (
    <LinearProgress variant="query" ref={inViewRef} />
  ) : formStructure ? (
    <GoogleFormEl formStructure={formStructure} content={content} />
  ) : null
}
