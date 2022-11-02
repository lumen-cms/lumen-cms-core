import React, { FC } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'

const LmScrollCollapse: FC<
  React.PropsWithChildren<{
    isScrollCollapse?: boolean
  }>
> = ({ children, isScrollCollapse }) => {
  const trigger = useScrollTrigger({ disableHysteresis: false })

  if (!isScrollCollapse) {
    return <>{children}</>
  }
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <div>{children}</div>
    </Slide>
  )
}

export default LmScrollCollapse
