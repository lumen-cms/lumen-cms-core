import InlineSVG from 'react-inlinesvg'
import React, { CSSProperties } from 'react'
import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles';
import { useInView } from 'react-intersection-observer'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'

const underscoreToMinus = (str: string) => str.replace(/_/g, '-')

const useStyles = makeStyles({
  icon: {
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
  }
})

const iconMap = {
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
}: IconCoreProps): JSX.Element {
  const classes = useStyles()
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
    <InlineSVG
      onClick={() => {
        onClick && onClick()
      }}
      style={style}
      className={clsx(classes.icon, 'lm-svg-icon', className, {
        [`size__${buttonSize}`]: buttonSize
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
