import { CSSProperties, FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

type LmAspectRatioProps = {
  width: number
  height: number
  className?: string
  style?: CSSProperties
}

const useStyles = makeStyles(() => ({
  ratio: {
    content: '',
    display: 'block',
    '@supports not (aspect-ratio: 1/1)': {
      height: 0,
      paddingBottom: 'calc(100% / (var(--aspect-ratio)))'
    },
    '@supports (aspect-ratio: 1/1)': {
      aspectRatio: 'calc(var(--aspect-ratio))'
    }
  },
  absolute: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    '& > div': {
      height: '100%'
    }
  },
  root: {
    position: 'relative'
  }
}))

const LmAspectRatio: FC<LmAspectRatioProps> = ({
  style,
  className,
  width,
  height,
  children
}) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(className, classes.root)}
      style={{
        ...style,
        // @ts-ignore
        '--aspect-ratio': `(${width / height})`
      }}
    >
      <div className={classes.ratio} />
      <div className={classes.absolute}>{children}</div>
    </div>
  )
}
export default LmAspectRatio
