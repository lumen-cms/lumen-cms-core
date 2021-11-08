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
  root: {
    position: 'relative',
    '& > span': {
      width: '100%!important',
      position: 'absolute!important',
      top: 0,
      left: 0,
      height: '100%!important'
    },
    '&:before': {
      content: '""',
      display: 'block',
      width: '100%',
      '@supports not (aspect-ratio: 1/1)': {
        height: 0,
        paddingBottom: 'calc(100% / (var(--aspect-ratio)))'
      },
      '@supports (aspect-ratio: 1/1)': {
        aspectRatio: 'calc(var(--aspect-ratio))'
      }
    }
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
        // eslint-disable-next-line
        // @ts-ignore
        '--aspect-ratio': `(${width / height})`
      }}
    >
      {children}
    </div>
  )
}
export default LmAspectRatio
