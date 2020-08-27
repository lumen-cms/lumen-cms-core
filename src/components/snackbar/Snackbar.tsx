import React, { useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import Cookies from 'js-cookie'
import { SnackbarStoryblok } from '../../typings/generated/components-schema'
import { LmComponentRender } from '../CoreComponents'


type LmSnackbarProps = {
  content: SnackbarStoryblok
}

const devMode = process.env.NODE_ENV !== 'production'


export function LmSnackbar({ content }: LmSnackbarProps) {
  const [open, setOpen] = React.useState<boolean>(false)

  const COOKIE_NAME = content?.cookie_name

  useEffect(
    () => {
      if (typeof window === 'undefined') {
        return
      }
      if (!COOKIE_NAME) {
        setOpen(true)
        return
      }

      const cookie = Cookies.get(COOKIE_NAME)
      if (!cookie) {
        setOpen(true)
      }

    },
    []
  )

  const handleAccept = () => {
    setOpen(false)

    if (!devMode && COOKIE_NAME) {
      Cookies.set(COOKIE_NAME, 'true', {
        expires: content?.expire_in_days || 1,
        secure: location ? location.protocol === 'https:' : true
      })
    }
  }

  if (!content) {
    return null
  }

  return (
    <Snackbar
      anchorOrigin={{
        horizontal: content.anchor_horizontal || 'center',
        vertical: content.anchor_vertical || 'bottom'
      }}
      open={open}
      classes={{}}
      style={{
        width: content.width ? content.width : undefined
      }}
    >
      <Alert
        style={{
          width: content.width ? content.width : undefined,
          backgroundColor: content.background_color?.rgba || undefined
        }}
        classes={{}} icon={false}
        variant={content.variant || undefined}
        severity={content.severity || undefined}
        action={
          <>
            {(content?.additional_actions || []).map(blok => <LmComponentRender content={blok} key={blok._uid} />)}
            {(content?.close_action || []).map(blok => <LmComponentRender content={blok} key={blok._uid}
                                                                          onClick={handleAccept} />)}
          </>}>
        {(content?.descriptions || []).map(blok => <LmComponentRender content={blok} key={blok._uid} />)}
      </Alert>
    </Snackbar>
  )
}
