import React, { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LmComponentRender } from '@LmComponentRender'
import dynamic from 'next/dynamic'
import { LmDialogAsyncProps, LmDialogProps } from './dialogTypes'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'

const LmDialog = dynamic(() => import('./LmDialog'))

export default function LmDialogElement({
  content
}: LmDialogProps): JSX.Element | null {
  const { fullscreen } = content
  const theme = useTheme()
  const { events } = useRouter()
  const mediaQueryResult = useMediaQuery(
    theme.breakpoints.down(fullscreen || 'sm')
  )
  const fullscreenOn = fullscreen === 'xl'
  const fullScreen = fullscreen ? mediaQueryResult : false
  const [isOpen, setOpen] = useState<boolean>(false)
  if (!Array.isArray(content.trigger)) {
    console.warn('The Dialog has not a correct trigger element.')
  }
  const dialogProps: LmDialogAsyncProps['dialogProps'] = {
    open: isOpen,
    fullScreen: fullscreenOn || fullScreen,
    onClose: content.prevent_click_outside ? undefined : () => setOpen(false)
  }
  useEffect(() => {
    const onRouteChange = () => {
      setOpen(false)
    }
    events.on('routeChangeComplete', onRouteChange)
    events.on('routeChangeError', onRouteChange)
    return () => {
      events.off('routeChangeComplete', onRouteChange)
      events.on('routeChangeError', onRouteChange)
    }
  }, [events, setOpen])

  return (
    <>
      <div style={{ cursor: 'pointer' }}>
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
