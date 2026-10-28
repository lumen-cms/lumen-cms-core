import InlineSVG from 'react-inlinesvg'
import { CSSProperties } from 'react'
import { useInView } from 'react-intersection-observer'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'

const underscoreToMinus = (str: string) => str.replace(/_/g, '-')

const IconSvg = styled(InlineSVG)({
  fill: 'currentColor',
  width: '1em',
  height: '1em',
  '&.size__lm-button-large': {
    width: 30,
    height: 30
  },
  '&.size__lm-button-xlarge': {
    width: 40,
    height: 40
  }
})

const iconMap: Record<string, string | undefined> = {
  call: 'phone',
  people: 'account-multiple',
  access_time: 'clock-outline',
  compare_arrows: 'compare',
  keyboard_arrow_down: 'chevron-down'
}

type IconCoreProps = {
  className?: string
  iconUrl?: string
  style?: CSSProperties
  iconName?: string
  buttonSize?: ButtonStoryblok['size']
  onClick?: () => void
}

function IconCore({
  className,
  style,
  iconName,
  buttonSize,
  iconUrl,
  onClick
}: IconCoreProps): React.JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  iconName = iconName ? iconMap[iconName as string] || iconName : undefined
  let iconSrc = ''
  if (inView && (iconUrl || iconName)) {
    iconSrc =
      iconUrl ||
      `https://cdn.jsdelivr.net/npm/@mdi/svg/svg/${underscoreToMinus(
        iconName as string
      )}.svg`
  }
  return iconSrc ? (
    <IconSvg
      onClick={() => {
        onClick && onClick()
      }}
      style={style}
      className={clsx('lm-svg-icon', className, {
        [`size__${buttonSize}`]: !!buttonSize
      })}
      onError={() => {
        console.error(`Icon not found: ${iconName}`)
        // console.error(e)
      }}
      src={iconSrc}
    />
  ) : (
    <span ref={refIntersectionObserver} />
  )
}

export default IconCore
