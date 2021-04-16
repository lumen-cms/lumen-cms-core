import LinearProgress from '@material-ui/core/LinearProgress'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { LmGoogleFormProps } from './googleFormProps'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { useGoogleForm } from '../../utils/hooks/googleForms/useGoogleForm'

const GoogleFormEl = dynamic(
  () => import(/* webpackChunkName: 'googleForm' */ './GoogleForm')
)
export default function LmGoogleFormContainer({ content }: LmGoogleFormProps) {
  const [inViewRef, elementInView] = useInView(intersectionDefaultOptions)
  const { formStructure } = useGoogleForm(
    elementInView ? content.api || '' : ''
  )
  return !formStructure ? (
    <LinearProgress variant="query" ref={inViewRef} />
  ) : (
    <GoogleFormEl formStructure={formStructure} content={content} />
  )
}
