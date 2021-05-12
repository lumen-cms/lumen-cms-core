import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { LmDialogAsyncProps, LmDialogProps } from './dialogTypes'

const LmDialog = dynamic(() => import('./LmDialog'))
const useStyles = makeStyles({
  trigger: {
    cursor: 'pointer'
  },
  dialogTitle: {
    '& .MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
})

export default function LmDialogElement({
  content
}: LmDialogProps): JSX.Element | null {
  const theme = useTheme()
  const classes = useStyles()
  const mediaQueryResult = useMediaQuery(
    theme.breakpoints.down(content.fullscreen || 'sm')
  )
  const fullScreen = content.fullscreen ? mediaQueryResult : false
  const [isOpen, setOpen] = useState<boolean>(false)
  if (!Array.isArray(content.trigger)) {
    console.warn('The Dialog has not a correct trigger element.')
  }
  const dialogProps: LmDialogAsyncProps['dialogProps'] = {
    open: isOpen,
    fullScreen,
    onClose: content.prevent_click_outside ? undefined : () => setOpen(false)
  }

  return (
    <>
      {/* eslint-disable-next-line */}
      <div className={classes.trigger}>
        {content.trigger?.map((blok) => (
          <LmComponentRender
            content={blok}
            key={blok._uid}
            onClick={() => {
              setOpen(true)
            }}
          />
        ))}
      </div>
      {isOpen && (
        <LmDialog
          content={content}
          dialogProps={dialogProps}
          setOpen={(value) => setOpen(value)}
        />
      )}
    </>
  )
}
