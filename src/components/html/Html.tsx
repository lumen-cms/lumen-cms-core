import { useInView } from 'react-intersection-observer'
import Box from '@mui/material/Box'
import { LmComponentRender } from '../CoreComponents'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmHtmlProps } from './htmlTypes'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'

export function LmHtml({ content }: LmHtmlProps): React.JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const advancedSx = getAdvancedSx({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  const style = {
    height:
      content.styles?.length || content.blocks?.length ? undefined : '100%'
  }
  if (!content.blocks?.length) {
    return (
      <Box
        sx={[advancedSx]}
        style={style}
        dangerouslySetInnerHTML={{
          __html: (!content.lazy_load
            ? content.body || ''
            : inView
            ? content.body || ''
            : '') as string
        }}
        ref={content.lazy_load ? refIntersectionObserver : undefined}
      />
    )
  }
  return (
    <Box
      sx={[advancedSx]}
      style={style}
      ref={content.lazy_load ? refIntersectionObserver : undefined}
    >
      {content.blocks?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </Box>
  )
}
