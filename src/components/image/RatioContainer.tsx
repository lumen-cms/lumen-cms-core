import React, { CSSProperties, FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
// based on following ideas: https://github.com/roderickhsiao/react-aspect-ratio
const CUSTOM_PROPERTY_NAME = '--aspect-ratio'

type AspectRatioProps = {
  ratio?: string | number // eslint-disable-line
  style?: CSSProperties
  className?: string
  [k: string]: any
}

const useStyles = makeStyles({
  root: {
    '&[style*="--aspect-ratio"] > :first-child': {
      width: '100%'
    },
    '&[style*="--aspect-ratio"] > img': {
      height: 'auto'
    },
    '@supports (--custom:property)': {
      '&[style*="--aspect-ratio"]': {
        position: 'relative'
      },
      '&[style*="--aspect-ratio"]::before': {
        height: 0,
        content: '""',
        display: 'block',
        paddingBottom: 'calc(100% / (var(--aspect-ratio)))'
      },
      '&[style*="--aspect-ratio"] > :first-child': {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%'
      }
    }
  }
})

export const AspectRatio: FC<AspectRatioProps> = (props) => {
  const classes = useStyles()
  const { ratio, style, children, className, ...otherProps } = props
  const newStyle = {
    ...style,
    // https://github.com/roderickhsiao/react-aspect-ratio/commit/53ec15858ae186c41e70b8c14cc5a5b6e97cb6e3
    [CUSTOM_PROPERTY_NAME]: `(${ratio})`
  }

  return (
    <div
      style={newStyle}
      className={clsx(className, classes.root)}
      {...otherProps}
    >
      {children}
    </div>
  )
}
AspectRatio.displayName = 'LmAspectContainer'
AspectRatio.defaultProps = {
  className: 'react-aspect-ratio-placeholder',
  ratio: 1
}
