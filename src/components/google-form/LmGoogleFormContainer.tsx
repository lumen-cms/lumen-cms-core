import LinearProgress from '@material-ui/core/LinearProgress'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { useAppContext } from '@context/AppContext'
import { LmGoogleFormProps } from './googleFormProps'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

const GoogleFormEl = dynamic(
  () => import(/* webpackChunkName: 'googleForm' */ './GoogleForm')
)
export default function LmGoogleFormContainer({ content }: LmGoogleFormProps) {
  const { formData } = useAppContext()

  const [inViewRef, elementInView] = useInView(intersectionDefaultOptions)
  // const { formStructure } = useGoogleForm(
  //   elementInView ? content.api || '' : ''
  // )
  const formStructure = formData?.[content._uid]
  return !elementInView ? (
    <LinearProgress variant="query" ref={inViewRef} />
  ) : (
    <GoogleFormEl formStructure={formStructure} content={content} />
  )
}
