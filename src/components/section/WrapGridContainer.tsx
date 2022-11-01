import React, { CSSProperties, FC } from 'react'

type WrapGridRowProps = {
  className?: string
  style?: CSSProperties
  hasCustomStyles?: boolean
}

const WrapGridRow: FC<React.PropsWithChildren<WrapGridRowProps>> = ({
  hasCustomStyles,
  style,
  children,
  className
}) =>
  hasCustomStyles ? (
    <div className={className} style={style}>
      {children}
    </div>
  ) : (
    <>{children}</>
  )

export default WrapGridRow
