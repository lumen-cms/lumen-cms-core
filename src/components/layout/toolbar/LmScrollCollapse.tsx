import React, { FC } from 'react'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'

const LmScrollCollapse: FC<{
  isScrollCollapse?: boolean
}> = ({ children, isScrollCollapse }) => {
  const trigger = useScrollTrigger({ disableHysteresis: false })

  if (!isScrollCollapse) {
    return <>{children}</>
  }
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children as any}
    </Slide>
  )
}

export default LmScrollCollapse
